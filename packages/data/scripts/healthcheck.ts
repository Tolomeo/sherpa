/* eslint-disable @typescript-eslint/no-non-null-assertion -- several indirect accesses force to null-assert */
import { randomUUID } from 'node:crypto'
import {
  Configuration,
  RequestQueue,
  BasicCrawler,
  CheerioCrawler,
  PlaywrightCrawler,
} from 'crawlee'
import type {
  BasicCrawlerOptions,
  BasicCrawlingContext,
  CheerioCrawlerOptions,
  CheerioCrawlingContext,
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
> {
  protected results = new Map<string, Deferred<HealthCheckResult>>()

  protected crawler: C

  async teardown() {
    await this.crawler.teardown()
    await this.crawler.requestQueue?.drop()
    this.results.clear()
  }

  async run(url: string) {
    const result = this.results.get(url)

    if (result) return result.promise

    this.results.set(url, new Deferred())
    await this.crawler.addRequests([url]).catch(console.error)
    !this.crawler.running && this.crawler.run().catch(console.error)
    return this.results.get(url)!.promise
  }
}

export class PdfFileHealthCheckRunner extends HealthCheckRunner<BasicCrawler> {
  static async create(_: undefined) {
    const requestQueue = await RequestQueue.open(randomUUID())
    return new PdfFileHealthCheckRunner(_, { requestQueue })
  }

  private constructor(
    _: undefined,
    crawlerOptions: Partial<BasicCrawlerOptions>,
  ) {
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

export interface HttpRequestHealthCheckRunnerConfig {
  titleSelector: string
}

export class HttpRequestHealthCheckRunner extends HealthCheckRunner<CheerioCrawler> {
  static async create(config: HttpRequestHealthCheckRunnerConfig) {
    const requestQueue = await RequestQueue.open(randomUUID())
    return new HttpRequestHealthCheckRunner(config, { requestQueue })
  }

  private constructor(
    private options: HttpRequestHealthCheckRunnerConfig,
    crawlerOptions: Partial<CheerioCrawlerOptions>,
  ) {
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

  requestHandler({ request, $ }: CheerioCrawlingContext) {
    const title = $(this.options.titleSelector).text()

    this.results.get(request.url)?.resolve({ success: true, data: { title } })
  }

  failedRequestHandler({ request }: CheerioCrawlingContext, error: Error) {
    this.results.get(request.url)?.resolve({ success: false, error })
  }
}

interface E2EHealthCheckRunnerConfig {
  titleSelector: string
}

export class E2EHealthCheckRunner extends HealthCheckRunner<PlaywrightCrawler> {
  static async create(config: E2EHealthCheckRunnerConfig) {
    const requestQueue = await RequestQueue.open(randomUUID())
    return new E2EHealthCheckRunner(config, { requestQueue })
  }

  private constructor(
    private options: E2EHealthCheckRunnerConfig,
    crawlerOptions: Partial<PlaywrightCrawlerOptions>,
  ) {
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

  async requestHandler({ page, request }: PlaywrightCrawlingContext) {
    const title =
      (await page.locator(this.options.titleSelector).textContent()) || ''
    this.results.get(request.url)?.resolve({ success: true, data: { title } })
  }

  failedRequestHandler({ request }: PlaywrightCrawlingContext, error: Error) {
    this.results.get(request.url)?.resolve({ success: false, error })
  }
}

interface YoutubeDataApiV3HealthCheckRunnerConfig {
  apiKey: string
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
  static async create(config: YoutubeDataApiV3HealthCheckRunnerConfig) {
    const requestQueue = await RequestQueue.open(randomUUID())
    return new YoutubeDataApiV3HealthCheckRunner(config, { requestQueue })
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

  private constructor(
    private options: YoutubeDataApiV3HealthCheckRunnerConfig,
    crawlerOptions: BasicCrawlerOptions,
  ) {
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
    const { apiKey } = this.options
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
          `Api response returned no matches: ${JSON.stringify(body)}`,
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

export type HealthCheckStrategy =
  | {
      runner: 'HttpRequest'
      config: HttpRequestHealthCheckRunnerConfig
    }
  | {
      runner: 'PdfFile'
      config?: undefined
    }
  | {
      runner: 'E2E'
      config: E2EHealthCheckRunnerConfig
    }
  | {
      runner: 'YoutubeData'
      config: YoutubeDataApiV3HealthCheckRunnerConfig
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
  private runners = new Map<
    string,
    | PdfFileHealthCheckRunner
    | HttpRequestHealthCheckRunner
    | E2EHealthCheckRunner
    | YoutubeDataApiV3HealthCheckRunner
  >()

  private async getRunner(strategy: HealthCheckStrategy) {
    const runnerId = JSON.stringify(strategy)
    let runner = this.runners.get(runnerId)

    if (runner) return runner

    switch (strategy.runner) {
      case 'PdfFile':
        runner = await PdfFileHealthCheckRunner.create(strategy.config)
        break
      case 'HttpRequest':
        runner = await HttpRequestHealthCheckRunner.create(strategy.config)
        break
      case 'E2E':
        runner = await E2EHealthCheckRunner.create(strategy.config)
        break
      case 'YoutubeData':
        runner = await YoutubeDataApiV3HealthCheckRunner.create(strategy.config)
        break
      default:
        throw new Error(
          `Unrecognized health check strategy "${strategy.runner}"`,
        )
    }

    this.runners.set(runnerId, runner)
    return runner
  }

  async run(url: string, strategy: HealthCheckStrategy) {
    const runner = await this.getRunner(strategy)
    return runner.run(url)
  }

  async teardown() {
    const runnersTeardown = Object.values(this.runners).map(
      (runner: PdfFileHealthCheckRunner | HttpRequestHealthCheckRunner) =>
        runner.teardown(),
    )
    await Promise.all(runnersTeardown)

    this.runners.clear()
  }
}
