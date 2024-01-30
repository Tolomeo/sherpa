import { describe, test, expect, beforeAll } from 'vitest'
// import { listPaths } from '../scripts/paths/read'
import { readResources } from '../scripts/resources/read'
import type { Resource } from '../src'
import { HealthCheck, HealthCheckStrategy } from '../scripts/healthcheck'

const getResourceHealthCheckStrategy = (
  resource: Resource,
): HealthCheckStrategy => {
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

describe('Resources', () => {
  // taking only first level paths
  /* const paths = listPaths()
    .filter((path) => path.split('.').length === 1)
    .slice(0, 1) */

  describe.each(['htmlcss'])('$topic resources', (path) => {
    const healthCheck = new HealthCheck(
      readResources(path).slice(0, 1),
      getResourceHealthCheckStrategy,
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
