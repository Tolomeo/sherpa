/* eslint-disable @typescript-eslint/no-non-null-assertion -- several indirect accesses force to null-assert */
import {
  Request,
  RequestQueue,
  BasicCrawler,
  CheerioCrawler,
  PlaywrightCrawler,
} from 'crawlee'
import type {
  Constructor,
  BasicCrawlerOptions,
  BasicCrawlingContext,
  CheerioCrawlerOptions,
  CheerioCrawlingContext,
  Dictionary,
  PlaywrightCrawlerOptions,
  PlaywrightCrawlingContext,
} from 'crawlee'
import * as cheerio from 'cheerio'
import { fileTypeFromBuffer } from 'file-type'
import { Deferred } from '../_utils/defer'

export { type Constructor, RequestQueue }

export type HealthCheckResult =
  | {
      success: true
      data: {
        title: string
      }
    }
  | {
      success: false
      error: Error
    }

abstract class HealthCheckRunner<
  C extends BasicCrawler | PlaywrightCrawler | CheerioCrawler,
  D extends Dictionary = Dictionary,
> {
  protected results = new Map<string, Deferred<HealthCheckResult>>()

  protected crawler: C

  async teardown() {
    await this.crawler.requestQueue?.drop()
    await this.crawler.teardown()
    this.results.clear()
  }

  async run(url: string, userData: D) {
    const result = this.results.get(url)

    if (result) return result.promise

    this.results.set(url, new Deferred())
    const request = new Request<D>({ url, userData })
    await this.crawler.addRequests([request]).catch(console.error)
    !this.crawler.running && this.crawler.run().catch(console.error)
    return this.results.get(url)!.promise
  }
}

export class PdfFileHealthCheckRunner extends HealthCheckRunner<BasicCrawler> {
  constructor(crawlerOptions: Partial<BasicCrawlerOptions>) {
    super()
    this.crawler = new BasicCrawler({
      ...crawlerOptions,
      keepAlive: true,
      retryOnBlocked: true,
      requestHandler: this.requestHandler.bind(this),
      failedRequestHandler: this.failedRequestHandler.bind(this),
    })
  }

  async requestHandler({ request, sendRequest }: BasicCrawlingContext) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- adapted from the official docs https://crawlee.dev/docs/guides/got-scraping#sendrequest-api
    const { body } = await sendRequest({
      responseType: 'buffer',
    })
    const file = await fileTypeFromBuffer(body as Buffer)

    if (!file || file.ext !== 'pdf' || file.mime !== 'application/pdf') {
      this.results.get(request.url)!.resolve({
        success: false,
        error: new Error(
          `The received buffer is not a pdf. The buffer is instead a ${JSON.stringify(
            file,
          )} filetype`,
        ),
      })
      return
    }

    this.results.get(request.url)?.resolve({
      success: true,
      data: { title: request.url.split('/').pop()! },
    })
  }

  failedRequestHandler({ request }: BasicCrawlingContext, error: Error) {
    this.results.get(request.url)?.resolve({ success: false, error })
  }
}

export interface HttpHealthCheckRequestData {
  titleSelector: string
}

export class HttpHealthCheckRunner extends HealthCheckRunner<CheerioCrawler> {
  constructor(crawlerOptions: Partial<CheerioCrawlerOptions>) {
    super()

    this.crawler = new CheerioCrawler({
      ...crawlerOptions,
      keepAlive: true,
      retryOnBlocked: true,
      requestHandler: this.requestHandler.bind(this),
      failedRequestHandler: this.failedRequestHandler.bind(this),
    })
  }

  requestHandler({
    request,
    $,
  }: CheerioCrawlingContext<HttpHealthCheckRequestData>) {
    const {
      userData: { titleSelector },
    } = request

    const title = $(titleSelector).text()

    this.results.get(request.url)?.resolve({ success: true, data: { title } })
  }

  failedRequestHandler({ request }: CheerioCrawlingContext, error: Error) {
    this.results.get(request.url)?.resolve({ success: false, error })
  }
}

export interface E2EHealthCheckRequestData {
  titleSelector: string
}

export class E2EHealthCheckRunner extends HealthCheckRunner<
  PlaywrightCrawler,
  E2EHealthCheckRequestData
> {
  constructor(crawlerOptions: Partial<PlaywrightCrawlerOptions>) {
    super()
    this.crawler = new PlaywrightCrawler({
      ...crawlerOptions,
      keepAlive: true,
      retryOnBlocked: true,
      requestHandler: this.requestHandler.bind(this),
      failedRequestHandler: this.failedRequestHandler.bind(this),
    })
  }

  async requestHandler({
    page,
    request,
  }: PlaywrightCrawlingContext<E2EHealthCheckRequestData>) {
    const {
      userData: { titleSelector },
    } = request

    const title = (await page.locator(titleSelector).textContent()) || ''

    this.results.get(request.url)?.resolve({ success: true, data: { title } })
  }

  failedRequestHandler(
    { request }: PlaywrightCrawlingContext<E2EHealthCheckRequestData>,
    error: Error,
  ) {
    this.results.get(request.url)?.resolve({ success: false, error })
  }
}

// NB: this type contains only what we are checking for in the response, when we pass 'snippet' as value for 'part' query parameter
// the actual response is richer
interface YoutubeDataApiResponse {
  items: {
    snippet: {
      title: string
    }
  }[]
  pageInfo: {
    totalResults: number
  }
}

export class YoutubeDataApiV3HealthCheckRunner extends HealthCheckRunner<BasicCrawler> {
  static getVideoId = (url: string) => {
    const videoUrl = /^https?:\/\/www\.youtube\.com\/watch\?v=(\S+)$/

    if (videoUrl.test(url)) {
      const [, videoId] = url.match(videoUrl)!
      return videoId
    }

    return null
  }

  static getPlaylistId = (url: string) => {
    const playlistUrl = /^https?:\/\/www\.youtube\.com\/playlist\?list=(\S+)$/

    if (playlistUrl.test(url)) {
      const [, playlistId] = url.match(playlistUrl)!
      return playlistId
    }

    return null
  }

  static getChannelId = (url: string) => {
    const channelUrl = /^https?:\/\/www.youtube.com\/(?:@|c\/){1}(\S+)$/

    if (channelUrl.test(url)) {
      const [, channelHandle] = url.match(channelUrl)!
      return channelHandle
    }

    return null
  }

  constructor(crawlerOptions: BasicCrawlerOptions) {
    super()
    this.crawler = new BasicCrawler({
      ...crawlerOptions,
      keepAlive: true,
      retryOnBlocked: true,
      requestHandler: this.requestHandler.bind(this),
      failedRequestHandler: this.failedRequestHandler.bind(this),
    })
  }

  getDataRequestUrl(url: string) {
    const apiBaseUrl = 'https://youtube.googleapis.com/youtube/v3'
    const { YOUTUBE_API_KEY: apiKey } = import.meta.env

    if (!apiKey) throw new Error(`Youtube data api key not found`)

    const { getVideoId, getPlaylistId, getChannelId } =
      YoutubeDataApiV3HealthCheckRunner

    const videoId = getVideoId(url)
    if (videoId)
      return `${apiBaseUrl}/videos?id=${videoId}&key=${apiKey}&part=snippet&maxResults=1`

    const playlistId = getPlaylistId(url)
    if (playlistId)
      return `${apiBaseUrl}/playlists?id=${playlistId}&key=${apiKey}&part=snippet&maxResults=1`

    // NB: youtube data api doesn't yet support retrieving channel's data by handle
    // therefore we are executing a channel search specifying the channel handle as query
    // see https://stackoverflow.com/a/74902789/3162406
    const channelId = getChannelId(url)
    if (channelId)
      return `${apiBaseUrl}/search?q=%40${channelId}&type=channel&key=${apiKey}&part=snippet&maxResults=1`

    throw new Error(
      `The url "${url}" is not recognizable as a valid video, playlist or channel youtube url`,
    )
  }

  async requestHandler({ request, sendRequest }: BasicCrawlingContext) {
    const dataRequestUrl = this.getDataRequestUrl(request.url)
    const { body } = (await sendRequest({
      url: dataRequestUrl,
      responseType: 'json',
    })) as { body: YoutubeDataApiResponse }

    if (body.pageInfo.totalResults < 1) {
      this.results.get(request.url)?.resolve({
        success: false,
        error: new Error(
          `Api response returned no results: ${JSON.stringify(body)}`,
        ),
      })
      return
    }

    this.results.get(request.url)?.resolve({
      success: true,
      data: {
        title: body.items[0].snippet.title,
      },
    })
  }

  failedRequestHandler({ request }: BasicCrawlingContext, error: Error) {
    this.results.get(request.url)?.resolve({ success: false, error })
  }
}

export interface ZenscrapeHealthCheckRequestData {
  titleSelector: string
  render: boolean
  premium: boolean
}

export class ZenscrapeHealthCheckRunner extends HealthCheckRunner<BasicCrawler> {
  constructor(crawlerOptions: BasicCrawlerOptions) {
    super()
    this.crawler = new BasicCrawler({
      ...crawlerOptions,
      keepAlive: true,
      retryOnBlocked: true,
      maxConcurrency: 1,
      requestHandler: this.requestHandler.bind(this),
      failedRequestHandler: this.failedRequestHandler.bind(this),
    })
  }

  getDataRequestUrl(url: string, render: boolean, premium: boolean) {
    let dataRequestUrl = `https://app.zenscrape.com/api/v1/get?url=${encodeURIComponent(
      url,
    )}`

    // apparently the scraper api doesn't accept 'false' as valid qs parameter
    // so we can only pass 'true' or omit the url parameter entirely
    if (render) {
      dataRequestUrl = `${dataRequestUrl}&render=true`
    }

    if (premium) {
      dataRequestUrl = `${dataRequestUrl}&premium=true`
    }

    return dataRequestUrl
  }

  async requestHandler({
    request,
    sendRequest,
  }: BasicCrawlingContext<ZenscrapeHealthCheckRequestData>) {
    const { ZENSCRAPE_API_KEY: apiKey } = import.meta.env

    if (!apiKey) throw new Error(`Zenscrape api key not found`)

    const { titleSelector, render, premium } = request.userData
    const dataRequestUrl = this.getDataRequestUrl(request.url, render, premium)
    const { body } = (await sendRequest({
      url: dataRequestUrl,
      headers: { apiKey },
    })) as { body: string }

    const $ = cheerio.load(body)
    const title = $(titleSelector).text()

    this.results.get(request.url)?.resolve({
      success: true,
      data: {
        title,
      },
    })
  }

  failedRequestHandler({ request }: BasicCrawlingContext, error: Error) {
    this.results.get(request.url)?.resolve({ success: false, error })
  }
}

// NB: this type contains only what we are checking for in the response
// the actual response is richer, see https://www.udemy.com/developers/affiliate/models/course/
// the available fields are defined by the 'fields' query parameter of the api request url
interface UdemyAffiliateApiResponse {
  title: string
}

export class UdemyAffiliateApiHealthCheckRunner extends HealthCheckRunner<BasicCrawler> {
  static getCourseSlug = (url: string) => {
    const courseUrl = /^https?:\/\/www\.udemy\.com\/course\/(\S+)$/

    if (courseUrl.test(url)) {
      const [, courseSlug] = url.match(courseUrl)!
      return courseSlug
    }

    return null
  }

  constructor(crawlerOptions: BasicCrawlerOptions) {
    super()
    this.crawler = new BasicCrawler({
      ...crawlerOptions,
      keepAlive: true,
      retryOnBlocked: true,
      requestHandler: this.requestHandler.bind(this),
      failedRequestHandler: this.failedRequestHandler.bind(this),
    })
  }

  getDataRequestUrl(url: string) {
    const apiBaseUrl = 'https://www.udemy.com/api-2.0/courses'
    const { getCourseSlug } = UdemyAffiliateApiHealthCheckRunner

    const courseSlug = getCourseSlug(url)

    if (courseSlug) return `${apiBaseUrl}/${courseSlug}?fields[course]=title`

    throw new Error(
      `The resource url ${url} is not recognizable as a valid Udemy course url`,
    )
  }

  async requestHandler({ request, sendRequest }: BasicCrawlingContext) {
    const {
      UDEMY_AFFILIATE_API_CLIENT_ID: clientId,
      UDEMY_AFFILIATE_API_CLIENT_SECRET: clientSecret,
    } = import.meta.env

    if (!clientId)
      throw new Error(`Udemy affialiate api client id was not found`)

    if (!clientSecret)
      throw new Error(`Udemy affialiate api client secret was not found`)

    const dataRequestUrl = this.getDataRequestUrl(request.url)
    const Authentication = `Basic ${Buffer.from(
      `${clientId}:${clientSecret}`,
    ).toString('base64')}`

    const { body } = (await sendRequest({
      url: dataRequestUrl,
      responseType: 'json',
      headers: {
        Authentication,
      },
    })) as { body: UdemyAffiliateApiResponse }

    this.results.get(request.url)?.resolve({
      success: true,
      data: {
        title: body.title,
      },
    })
  }

  failedRequestHandler({ request }: BasicCrawlingContext, error: Error) {
    this.results.get(request.url)?.resolve({ success: false, error })
  }
}
