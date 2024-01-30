import { describe, test, expect, beforeAll } from 'vitest'
// import { listPaths } from '../scripts/paths/read'
import { CheerioCrawler, log } from 'crawlee'
import { readResources } from '../scripts/resources/read'
import type { Resource } from '../dist'

type HealthCheckResult =
  | {
      success: true
      data: {
        title: string
      }
    }
  | {
      success: false
    }

type HealthCheckRunResult = Record<string, HealthCheckResult>

interface HttpRequestHealthCheckRunnerConfig {
  titleSelector: string
}

interface HealthCheckRunner {
  run: (...urls: string[]) => Promise<HealthCheckRunResult>
}

class HttpRequestHealthCheckRunner implements HealthCheckRunner {
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

type HealthCheckStrategy =
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

const getStrategy = (resource: Resource): HealthCheckStrategy => {
  // checking if it is a downloadable resource
  // so far only PDFs
  if (resource.url.match(/\.pdf$/)) {
    return { runner: 'request.binary' }
  }

  const host = new URL(resource.url).hostname.replace(/^www./, '')

  switch (host) {
    case 'youtube.com':
      return { runner: 'request.youtube' }

    case 'programmingpercy.tech':
    case 'gogognome.nl':
    case 'superfastpython.com':
    case 'phuoc.ng':
    case 'tsh.io':
      return { runner: 'HttpRequest', config: { titleSelector: 'h1' } }

    case 'blob42.xyz':
      return { runner: 'HttpRequest', config: { titleSelector: 'h3' } }

    case 'thevaluable.dev':
    case 'usehooks-ts.com':
    case 'developer.ibm.com':
    case 'davrous.com':
    case 'zzapper.co.uk':
    case 'launchschool.com':
    case 'wattenberger.com':
    case 'gameaccessibilityguidelines.com':
    case 'app.codecrafters.io':
    case 'animatedbackgrounds.me':
    case 'conventionalcommits.org':
    case 'harrisoncramer.me':
    case 'tldp.org':
    case 'gitexplorer.com':
    case 'ubuntu.com':
    case 'curlbuilder.com':
      return { runner: 'render.browser', config: { titleSelector: 'title' } }

    case 'reactdigest.net':
    case 'data-flair.training':
    case 'linux.org':
    case 'snipcart.com':
      return {
        runner: 'request.zenscrape',
        config: {
          titleSelector: 'title',
          render: false,
          premium: false,
        },
      }

    case 'bash.cyberciti.biz':
    case 'git.herrbischoff.com':
    case 'codementor.io':
    case 'codepen.io':
    case 'replit.com':
      return {
        runner: 'request.zenscrape',
        config: {
          titleSelector: 'title',
          render: true,
          premium: false,
        },
      }

    case 'ui.dev':
    case 'developer.apple.com':
    case 'udemy.com':
    case 'regexr.com':
    case 'tooltester.com':
      return {
        runner: 'request.zenscrape',
        config: {
          titleSelector: 'title',
          render: false,
          premium: true,
        },
      }

    case 'pexels.com':
    case 'adobe.com':
      return {
        runner: 'request.zenscrape',
        config: {
          titleSelector: 'title',
          render: true,
          premium: true,
        },
      }

    default:
      return {
        runner: 'HttpRequest',
        config: {
          titleSelector: 'title',
        },
      }
  }
}

class HealthCheck {
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

describe('Resources', () => {
  // taking only first level paths
  /* const paths = listPaths()
    .filter((path) => path.split('.').length === 1)
    .slice(0, 1) */

  describe.each(['htmlcss'])('$topic resources', (path) => {
    const healthCheck = new HealthCheck(
      readResources(path).slice(0, 1),
      getStrategy,
    )

    beforeAll(async () => {
      await healthCheck.run()
    })

    test.each(readResources(path).slice(0, 1))('$url', () => {
      console.log(healthCheck.results)
      expect(1).toBe(1)
    })
  })
})
