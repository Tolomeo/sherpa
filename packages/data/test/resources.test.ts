import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { listPaths } from '../scripts/paths/read'
import { readResources } from '../scripts/resources/read'
import type { Resource } from '../src'
import type { HealthCheckStrategy } from '../scripts/healthcheck'
import { HealthCheck } from '../scripts/healthcheck'

const getResourceHealthCheckStrategy = (
  resource: Resource,
): HealthCheckStrategy => {
  // checking if it is a downloadable resource
  // so far only PDFs
  if (resource.url.match(/\.pdf$/)) {
    return { runner: 'PdfFile' }
  }

  const host = new URL(resource.url).hostname.replace(/^www./, '')

  switch (host) {
    case 'udemy.com':
      return {
        runner: 'UdemyAffiliate',
      }
    case 'youtube.com':
      return {
        runner: 'YoutubeData',
      }

    case 'programmingpercy.tech':
    case 'gogognome.nl':
    case 'superfastpython.com':
    case 'phuoc.ng':
    case 'tsh.io':
      return { runner: 'Http', config: { titleSelector: 'h1' } }

    case 'blob42.xyz':
      return { runner: 'Http', config: { titleSelector: 'h3' } }

    case 'freecodecamp.org':
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
    case 'refrf.dev':
    case 'codepen.io':
      return {
        runner: 'E2E',
        config: { titleSelector: 'title:not(:empty)' },
      }

    case 'reactdigest.net':
    case 'data-flair.training':
    case 'linux.org':
    case 'snipcart.com':
      return {
        runner: 'Zenscrape',
        config: {
          titleSelector: 'title:not(:empty)',
          render: false,
          premium: false,
        },
      }

    case 'bash.cyberciti.biz':
    case 'git.herrbischoff.com':
    case 'codementor.io':
    case 'replit.com':
      return {
        runner: 'Zenscrape',
        config: {
          titleSelector: 'title:not(:empty)',
          render: true,
          premium: false,
        },
      }

    case 'ui.dev':
    case 'developer.apple.com':
    case 'regexr.com':
    case 'tooltester.com':
      return {
        runner: 'Zenscrape',
        config: {
          titleSelector: 'title:not(:empty)',
          render: false,
          premium: true,
        },
      }

    case 'pexels.com':
    case 'adobe.com':
      return {
        runner: 'Zenscrape',
        config: {
          titleSelector: 'title:not(:empty)',
          render: true,
          premium: true,
        },
      }

    default:
      return {
        runner: 'Http',
        config: {
          titleSelector: 'title:not(:empty)',
        },
      }
  }
}

describe('Resources', () => {
  let healthCheck: HealthCheck

  beforeAll(() => {
    healthCheck = new HealthCheck()
  })

  afterAll(async () => {
    await healthCheck.teardown()
  })

  // taking only first level paths
  // const paths = listPaths().filter((path) => path.split('.').length === 1)
  const paths = ['htmlcss']

  describe.each(paths)('%s resources', (path) => {
    const resources = readResources(path)
    /* const resources = [
      {
        title: 'State of CSS',
        url: 'https://stateofcss.com/en-US',
        type: 'feed',
      },
      {
        title: 'CodePen',
        url: 'https://codepen.io',
        type: 'feed',
      },
      {
        title: 'HTML Standard',
        url: 'https://html.spec.whatwg.org/multipage',
        type: 'reference',
      },
    ] as Resource[] */

    test.each(resources)(
      '$url',
      async (resource) => {
        const resourceHealthCheck = await healthCheck.run(
          resource.url,
          getResourceHealthCheckStrategy(resource),
        )

        expect(resourceHealthCheck).toMatchObject({
          url: resource.url,
          success: true,
          data: { title: expect.stringContaining(resource.title) as string },
        })
      },
      120_000,
    )
  })
})
