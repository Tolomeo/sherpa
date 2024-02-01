/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-non-null-assertion -- several indirect accesses force to null-assert */
import { randomUUID } from 'node:crypto'
import {
  Request,
  Configuration,
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
import { fileTypeFromBuffer } from 'file-type'
import { Deferred } from './_utils/defer'

const configuration = new Configuration({ persistStorage: false })

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
    await this.crawler.teardown()
    await this.crawler.requestQueue?.drop()
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
  static async create() {
    const requestQueue = await RequestQueue.open(randomUUID())
    return new PdfFileHealthCheckRunner({ requestQueue })
  }

  constructor(crawlerOptions: Partial<BasicCrawlerOptions>) {
    super()
    this.crawler = new BasicCrawler(
      {
        ...crawlerOptions,
        keepAlive: true,
        requestHandler: this.requestHandler.bind(this),
        failedRequestHandler: this.failedRequestHandler.bind(this),
      },
      configuration,
    )
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

export interface HttpRequestHealthCheckRequestData {
  titleSelector: string
}

export class HttpRequestHealthCheckRunner extends HealthCheckRunner<CheerioCrawler> {
  static async create() {
    const requestQueue = await RequestQueue.open(randomUUID())
    return new HttpRequestHealthCheckRunner({ requestQueue })
  }

  constructor(crawlerOptions: Partial<CheerioCrawlerOptions>) {
    super()

    this.crawler = new CheerioCrawler(
      {
        ...crawlerOptions,
        keepAlive: true,
        requestHandler: this.requestHandler.bind(this),
        failedRequestHandler: this.failedRequestHandler.bind(this),
      },
      configuration,
    )
  }

  requestHandler({
    request,
    $,
  }: CheerioCrawlingContext<HttpRequestHealthCheckRequestData>) {
    console.log(request.userData)
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

interface E2EHealthCheckRequestData {
  titleSelector: string
}

export class E2EHealthCheckRunner extends HealthCheckRunner<
  PlaywrightCrawler,
  E2EHealthCheckRequestData
> {
  static async create() {
    const requestQueue = await RequestQueue.open(randomUUID())
    return new E2EHealthCheckRunner({ requestQueue })
  }

  constructor(crawlerOptions: Partial<PlaywrightCrawlerOptions>) {
    super()
    this.crawler = new PlaywrightCrawler(
      {
        ...crawlerOptions,
        keepAlive: true,
        requestHandler: this.requestHandler.bind(this),
        failedRequestHandler: this.failedRequestHandler.bind(this),
      },
      configuration,
    )
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

class YoutubeDataApiV3HealthCheckRunner extends HealthCheckRunner<BasicCrawler> {
  static async create() {
    const requestQueue = await RequestQueue.open(randomUUID())
    return new YoutubeDataApiV3HealthCheckRunner({ requestQueue })
  }

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
    this.crawler = new BasicCrawler(
      {
        ...crawlerOptions,
        keepAlive: true,
        requestHandler: this.requestHandler.bind(this),
        failedRequestHandler: this.failedRequestHandler.bind(this),
      },
      configuration,
    )
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

export type HealthCheckRunners =
  | PdfFileHealthCheckRunner
  | HttpRequestHealthCheckRunner
  | E2EHealthCheckRunner
  | YoutubeDataApiV3HealthCheckRunner

export type HealthCheckStrategy =
  | {
      runner: 'HttpRequest'
      config: HttpRequestHealthCheckRequestData
    }
  | {
      runner: 'PdfFile'
      config?: undefined
    }
  | {
      runner: 'E2E'
      config: E2EHealthCheckRequestData
    }
  | {
      runner: 'YoutubeData'
      config?: undefined
    }
  | {
      runner: 'request.zenscrape'
      config: {
        titleSelector: string
        render: boolean
        premium: boolean
      }
    }

export class HealthCheck {
  private runners = new Map<string, HealthCheckRunners>()

  async getRunner<R extends HealthCheckRunners>(
    key: string,
    Runner: Constructor<R>,
  ): Promise<R> {
    let runner = this.runners.get(key)

    if (runner) return runner as R

    const requestQueue = await RequestQueue.open(randomUUID())
    runner = new Runner({ requestQueue })
    this.runners.set(key, runner)
    return runner as R
  }

  async run(url: string, strategy: HealthCheckStrategy) {
    let runner: HealthCheckRunners

    switch (strategy.runner) {
      case 'PdfFile':
        runner = await this.getRunner('PdfFile', PdfFileHealthCheckRunner)
        return runner.run(url, {})
      case 'HttpRequest':
        runner = await this.getRunner(
          'HttpRequest',
          HttpRequestHealthCheckRunner,
        )
        return runner.run(url, strategy.config)
      case 'E2E':
        runner = await this.getRunner('E2E', E2EHealthCheckRunner)
        return runner.run(url, strategy.config)
      case 'YoutubeData':
        runner = await this.getRunner(
          'YoutubeData',
          YoutubeDataApiV3HealthCheckRunner,
        )
        return runner.run(url, {})
      default:
        throw new Error(
          `Unrecognized health check strategy "${strategy.runner}"`,
        )
    }
  }

  async teardown() {
    const runnersTeardown = Object.values(this.runners).map(
      (runner: HealthCheckRunners) => runner.teardown(),
    )
    await Promise.all(runnersTeardown)

    this.runners.clear()
  }
}
