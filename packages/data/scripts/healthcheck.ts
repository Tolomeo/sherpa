import { BasicCrawler, CheerioCrawler, log } from 'crawlee'
import { fileTypeFromBuffer } from 'file-type'
import type { Resource } from '../src'

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

export type HealthCheckRunResult = Record<string, HealthCheckResult>

export class PdfFileHealthCheckRunner implements HealthCheckRunner {
  private crawler: BasicCrawler

  private results: HealthCheckRunResult = {}

  constructor(_: undefined) {
    const { results } = this
    this.crawler = new BasicCrawler({
      async requestHandler({ request, sendRequest }) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { body } = await sendRequest({
          responseType: 'buffer',
        })
        const file = await fileTypeFromBuffer(body as ArrayBuffer)

        console.log(request)

        if (file?.ext === 'pdf' && file.mime === 'application/pdf') {
          results[request.url] = {
            success: true,
            data: { title: request.url.split('/').pop()! },
          }
        } else {
          results[request.url] = {
            success: false,
          }
        }
      },
      failedRequestHandler({ request }) {
        results[request.url] = { success: false }
      },
    })
  }

  async run(...urls: string[]) {
    await this.crawler.run(urls)
    return this.results
  }
}

export interface HttpRequestHealthCheckRunnerConfig {
  titleSelector: string
}

export interface HealthCheckRunner {
  run: (...urls: string[]) => Promise<HealthCheckRunResult>
}

export class HttpRequestHealthCheckRunner implements HealthCheckRunner {
  private crawler: CheerioCrawler

  private results: HealthCheckRunResult = {}

  constructor({ titleSelector }: HttpRequestHealthCheckRunnerConfig) {
    const { results } = this

    this.crawler = new CheerioCrawler({
      requestHandler({ request, $ }) {
        log.debug(`Processing ${request.url}...`)

        // Extract data from the page using cheerio.
        const title = $(titleSelector).text()

        results[request.url] = { success: true, data: { title } }
      },
      failedRequestHandler({ request }) {
        results[request.url] = { success: false }
      },
    })
  }

  async run(...urls: string[]) {
    await this.crawler.run(urls)
    return this.results
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
      runner: 'render.browser'
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
  constructor(
    public resources: Resource[],
    public strategy: (resource: Resource) => HealthCheckStrategy,
  ) {}

  results: Record<string, HealthCheckResult> = {}

  async run() {
    const runGroups = this.resources.reduce<Record<string, Resource[]>>(
      (groups, resource) => {
        const strategy = this.strategy(resource)
        const strategyId = JSON.stringify(strategy)

        if (!groups[strategyId]) {
          groups[strategyId] = []
        }

        groups[strategyId].push(resource)
        return groups
      },
      {},
    )

    const groupRunResults = await Promise.all(
      Object.entries(runGroups).map(([strategy, resources]) => {
        const { runner, config } = JSON.parse(strategy) as HealthCheckStrategy
        const urls = resources.map(({ url }) => url)

        // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
        switch (runner) {
          case 'PdfFile':
            return new PdfFileHealthCheckRunner(config).run(...urls)
          case 'HttpRequest':
            return new HttpRequestHealthCheckRunner(config).run(...urls)
        }

        throw new Error(`Unrecognized health check strategy "${runner}"`)

        /* switch (runner) {
        case 'HttpRequest':
            return new HttpRequestHealthCheckRunner(config).run(
              ...resources.map(({ url }) => url),
            )
        /* case 'request.binary':
				case 'render.browser':
				case 'request.youtube':
				case 'request.zenscrape': */
        // } */
      }),
    )

    this.results = groupRunResults.reduce<Record<string, HealthCheckResult>>(
      (results, groupResults) => {
        return { ...results, ...groupResults }
      },
      {},
    )
  }
}
