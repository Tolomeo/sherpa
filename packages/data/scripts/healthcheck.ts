import { CheerioCrawler, log } from 'crawlee'
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
      runner: 'request.binary'
      config?: object
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
        const { config } = JSON.parse(strategy) as {
          runner: 'HttpRequest'
          config: HttpRequestHealthCheckRunnerConfig
        }

        return new HttpRequestHealthCheckRunner(config).run(
          ...resources.map(({ url }) => url),
        )

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
