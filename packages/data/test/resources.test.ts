import { describe, test, expect, beforeAll, afterAll } from 'vitest'
// import { listPaths } from '../scripts/paths/read'
// import { readResources } from '../scripts/resources/read'
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

const resources: Resource[] = [
  /* {
    title: 'Interneting Is Hard',
    url: 'https://internetingishard.netlify.app',
    type: 'basics' as Resource['type'],
    source: 'internetingishard.netlify.app',
  },
  {
    title: 'EnterpriseDesignSprints',
    url: 'https://s3.amazonaws.com/designco-web-assets/uploads/2019/05/InVision_EnterpriseDesignSprints.pdf',
    type: 'advanced' as Resource['type'],
    source: 'designbetter.co',
  }, */
  {
    title: 'Responsive Web Design Certification',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
    type: 'basics' as Resource['type'],
    source: 'freecodecamp.org',
  },
]

describe('Resources', () => {
  // taking only first level paths
  /* const paths = listPaths()
    .filter((path) => path.split('.').length === 1)
    .slice(0, 1) */

  describe.each(['htmlcss'])('$topic resources', () => {
    let healthCheck: HealthCheck
    beforeAll(() => {
      healthCheck = new HealthCheck()
    })
    afterAll(async () => {
      await healthCheck.teardown()
    })

    test.each(resources)(
      '$url',
      async (resource) => {
        const resourceHealthCheck = await healthCheck.run(
          resource.url,
          getResourceHealthCheckStrategy(resource),
        )

        expect(resourceHealthCheck.success).toBe(true)

        if (resourceHealthCheck.success) {
          expect(resourceHealthCheck.data.title).toContain(resource.title)
        }
      },
      30000,
    )
  })
})
