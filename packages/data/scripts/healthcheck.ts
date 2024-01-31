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
  CheerioCrawlerOptions,
  PlaywrightCrawlerOptions,
} from 'crawlee'
import { fileTypeFromBuffer } from 'file-type'

export class Deferred<T = unknown> {
  private _promise: Promise<T>
  private _resolve!: (value: T | PromiseLike<T>) => void
  private _reject!: (reason?: unknown) => void
  public status: 'pending' | 'resolved' | 'rejected' = 'pending'
  public promise: Promise<T>

  public constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
    this.promise = this._promise
  }

  public reject(reason?: unknown): void {
    this.status = 'rejected'
    this._reject(reason)
  }

  public resolve(value: T): void {
    this.status = 'resolved'
    this._resolve(value)
  }

  public then(onfulfilled: (value: T) => T | PromiseLike<T>) {
    this.promise = this.promise.then(onfulfilled)
    return this
  }

  public catch(onrejected: (reason: unknown) => T | PromiseLike<T> | never) {
    this.promise = this.promise.catch(onrejected)
    return this
  }

  public finally(onfinally: (() => void) | undefined | null) {
    this.promise = this.promise.finally(onfinally)
    return this
  }
}

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
    }

export interface HealthCheckRunner {
  results: Map<string, Deferred<HealthCheckResult>>
  run: (url: string) => Promise<HealthCheckResult>
  teardown: () => Promise<void>
}

export class PdfFileHealthCheckRunner implements HealthCheckRunner {
  static async create(_: undefined) {
    const requestQueue = await RequestQueue.open(randomUUID())
    return new PdfFileHealthCheckRunner(_, { requestQueue })
  }

  private crawler: BasicCrawler

  results = new Map<string, Deferred<HealthCheckResult>>()

  private constructor(
    _: undefined,
    crawlerOptions: Partial<BasicCrawlerOptions>,
  ) {
    const { results } = this
    this.crawler = new BasicCrawler(
      {
        ...crawlerOptions,
        keepAlive: true,
        async requestHandler({ request, sendRequest }) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- adapted from the official docs https://crawlee.dev/docs/guides/got-scraping#sendrequest-api
          const { body } = await sendRequest({
            responseType: 'buffer',
          })
          const file = await fileTypeFromBuffer(body as Buffer)

          if (!file || file.ext !== 'pdf' || file.mime !== 'application/pdf') {
            results.get(request.url)!.resolve({ success: false })
            return
          }

          results.get(request.url)?.resolve({
            success: true,
            data: { title: request.url.split('/').pop()! },
          })
        },
        failedRequestHandler({ request }) {
          results.get(request.url)?.resolve({ success: false })
        },
      },
      configuration,
    )
  }

  async teardown() {
    await this.crawler.teardown()
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

export interface HttpRequestHealthCheckRunnerConfig {
  titleSelector: string
}

export class HttpRequestHealthCheckRunner implements HealthCheckRunner {
  static async create(config: HttpRequestHealthCheckRunnerConfig) {
    const requestQueue = await RequestQueue.open(randomUUID())
    return new HttpRequestHealthCheckRunner(config, { requestQueue })
  }

  private crawler: CheerioCrawler

  results = new Map<string, Deferred<HealthCheckResult>>()

  private constructor(
    { titleSelector }: HttpRequestHealthCheckRunnerConfig,
    crawlerOptions: Partial<CheerioCrawlerOptions>,
  ) {
    const { results } = this

    this.crawler = new CheerioCrawler(
      {
        ...crawlerOptions,
        keepAlive: true,
        requestHandler({ request, $ }) {
          const title = $(titleSelector).text()

          results.get(request.url)?.resolve({ success: true, data: { title } })
        },
        failedRequestHandler({ request }) {
          results.get(request.url)?.resolve({ success: false })
        },
      },
      configuration,
    )
  }

  async teardown() {
    await this.crawler.teardown()
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

interface E2EHealthCheckRunnerConfig {
  titleSelector: string
}

export class E2EHealthCheckRunner implements HealthCheckRunner {
  static async create(config: E2EHealthCheckRunnerConfig) {
    const requestQueue = await RequestQueue.open(randomUUID())
    return new E2EHealthCheckRunner(config, { requestQueue })
  }

  private crawler: PlaywrightCrawler

  results = new Map<string, Deferred<HealthCheckResult>>()

  private constructor(
    { titleSelector }: E2EHealthCheckRunnerConfig,
    crawlerOptions: Partial<PlaywrightCrawlerOptions>,
  ) {
    const { results } = this
    this.crawler = new PlaywrightCrawler(
      {
        ...crawlerOptions,
        keepAlive: true,
        async requestHandler({ page, request }) {
          console.log(request.url)

          const title = (await page.locator(titleSelector).textContent()) || ''
          results.get(request.url)?.resolve({ success: true, data: { title } })
        },
        failedRequestHandler({ request }) {
          results.get(request.url)?.resolve({ success: false })
        },
      },
      configuration,
    )
  }

  async teardown() {
    await this.crawler.teardown()
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
      config: {
        titleSelector: string
      }
    }
  | {
      runner: 'request.youtube'
      config?: object
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
