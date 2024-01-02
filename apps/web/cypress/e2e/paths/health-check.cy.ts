import { SerializedResource } from '@sherpa/data'
import config from '../../../src/config'

const uniqueResources = ((topics: string[]) => {
  const uniques: Record<string, SerializedResource> = {}

  topics.forEach((topicName) => {
    const topicResources = require(
      `@sherpa/data/resources/json/${topicName}.json`,
    ) as SerializedResource[]

    topicResources.forEach((serializedResource) => {
      if (uniques[serializedResource.url]) return

      uniques[serializedResource.url] = serializedResource
    })
  })

  return Object.values(uniques)
})(config.paths.topics)

const duplicatedResources = ((topics: string[]) => {
  const uniques: Record<string, SerializedResource> = {}
  const duplicates: Record<string, SerializedResource[]> = {}

  topics.forEach((topicName) => {
    const topicResources = require(
      `@sherpa/data/resources/json/${topicName}.json`,
    ) as SerializedResource[]

    topicResources.forEach((serializedResource) => {
      if (!uniques[serializedResource.url]) {
        uniques[serializedResource.url] = serializedResource
        return
      }

      if (!duplicates[serializedResource.url]) {
        duplicates[serializedResource.url] = [
          uniques[serializedResource.url],
          serializedResource,
        ]
        return
      }

      duplicates[serializedResource.url].push(serializedResource)
    })
  })

  return Object.entries(duplicates)
})(config.paths.topics)

const checkResourceHealth = (resource: SerializedResource) => {
  // checking if it is a downloadable resource
  // so far only PDFs
  if (resource.url.match(/\.pdf$/)) {
    return cy.checkHealthByBinaryRequest(resource)
  }

  const host = new URL(resource.url).hostname.replace(/^www./, '')

  switch (host) {
    case 'youtube.com':
      return cy.checkHealthByYoutubeDataAPIv3Request(resource, {
        apikey: Cypress.env('YOUTUBE_API_KEY'),
      })
    case 'programmingpercy.tech':
    case 'gogognome.nl':
    case 'superfastpython.com':
    case 'phuoc.ng':
    case 'tsh.io':
      return cy.checkHealthByUrlRequest(resource, { titleSelector: 'h1' })
    case 'blob42.xyz':
      return cy.checkHealthByUrlRequest(resource, { titleSelector: 'h3' })
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
    case 'linux.org':
    case 'conventionalcommits.org':
    case 'harrisoncramer.me':
    case 'tldp.org':
    case 'gitexplorer.com':
    case 'ubuntu.com':
      return cy.checkHealthByVisit(resource)
    case 'reactdigest.net':
    case 'data-flair.training':
    case 'codepen.io':
    case 'replit.com':
    case 'git.herrbischoff.com':
    case 'linux.org':
    case 'snipcart.com':
      return cy.checkHealthByScraperRequest(resource, {
        apikey: Cypress.env('ZENSCRAPE_API_KEY'),
      })
    case 'bash.cyberciti.biz':
    case 'codementor.io':
      return cy.checkHealthByScraperRequest(resource, {
        apikey: Cypress.env('ZENSCRAPE_API_KEY'),
        render: true,
      })
    case 'adobe.com':
    case 'ui.dev':
    case 'developer.apple.com':
    case 'udemy.com':
    case 'regexr.com':
    case 'tooltester.com':
      return cy.checkHealthByScraperRequest(resource, {
        apikey: Cypress.env('ZENSCRAPE_API_KEY'),
        premium: true,
      })
    case 'pexels.com':
      return cy.checkHealthByScraperRequest(resource, {
        apikey: Cypress.env('ZENSCRAPE_API_KEY'),
        render: true,
        premium: true,
      })
    default:
      return cy.checkHealthByUrlRequest(resource)
  }
}

describe('Resources', () => {
  describe('Duplicated resources', () => {
    duplicatedResources.forEach(([duplicatedUrl, duplicatedUrlResources]) => {
      it(`"${duplicatedUrlResources[0].title}" [ ${duplicatedUrl} ] : ${duplicatedUrlResources.length} duplicates`, () => {
        cy.wrap(duplicatedUrlResources).each((duplicatedUrlResource) => {
          expect(duplicatedUrlResource).to.deep.equal(duplicatedUrlResources[0])
        })
      })
    })
  })

  describe('Health check', () => {
    uniqueResources.forEach((resource) => {
      it(`"${resource.title}" [ ${resource.url} ]`, () => {
        // this event will automatically be unbound when this test ends
        // returning false here prevents Cypress from
        // failing the test when an uncaught exception is thrown by the resource page
        cy.on('uncaught:exception', () => false)

        checkResourceHealth(resource)
      })
    })
  })
})
