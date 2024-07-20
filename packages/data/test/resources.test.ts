import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { getParents } from '../src/topic'
import { getById } from '../src/resource'
import type { ResourceData } from '../types/resource'
import { HealthCheck, type HealthCheckStrategy } from '../scripts/healthcheck'

const getResourceHealthCheckStrategy = (
  resource: ResourceData,
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
    case 'davrous.com':
    case 'zzapper.co.uk':
    case 'launchschool.com':
    case 'wattenberger.com':
    case 'gameaccessibilityguidelines.com':
    case 'app.codecrafters.io':
    case 'animatedbackgrounds.me':
    case 'harrisoncramer.me':
    case 'tldp.org':
    case 'ubuntu.com':
    case 'curlbuilder.com':
    case 'refrf.dev':
    case 'codepen.io':
    case 'webdesignmuseum.org':
    case 'pexels.com':
    case 'adobe.com':
    case 'deniskyashif.com':
    case 'reactbyexample.github.io':
    case 'codelivly.com':
    case 'cmdchallenge.com':
    case 'replit.com':
    case 'bash.cyberciti.biz':
      return {
        runner: 'E2E',
        config: {
          titleSelector: 'title:not(:empty)',
          waitForLoadState: 'domcontentloaded',
        },
      }

    // this loads a generic page, with valid title and then fetches more data updating content and title
    case 'developer.ibm.com':
      return {
        runner: 'E2E',
        config: {
          titleSelector: 'title:not(empty)',
          waitForLoadState: 'networkidle',
        },
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

    case 'git.herrbischoff.com':
    case 'codementor.io':
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

    /* case 'adobe.com':
      return {
        runner: 'Zenscrape',
        config: {
          titleSelector: 'title:not(:empty)',
          render: true,
          premium: true,
        },
      } */

    default:
      return {
        runner: 'Http',
        config: {
          titleSelector: 'title:not(:empty)',
        },
      }
  }
}

describe('Resources', async () => {
  const topics = await getParents()
  let healthCheck: HealthCheck

  beforeAll(() => {
    healthCheck = new HealthCheck()
  })

  afterAll(async () => {
    await healthCheck.teardown()
  })

  describe.each(topics)('$topic resources', async (topic) => {
    const pathResourceUrls = await topic.getResources()
    const pathResources = await Promise.all(
      pathResourceUrls.map((url) => getById(url)),
    )

    test.each(pathResources)(
      '$url',
      async (resource) => {
        const resourceData = resource!.get()
        const resourceHealthCheck = await healthCheck.run(
          resourceData.url,
          getResourceHealthCheckStrategy(resourceData),
        )

        expect(resourceHealthCheck).toMatchObject({
          url: resourceData.url,
          success: true,
          data: {
            title: expect.stringContaining(resourceData.title) as string,
          },
        })
      },
      150_000,
    )
  })
})
