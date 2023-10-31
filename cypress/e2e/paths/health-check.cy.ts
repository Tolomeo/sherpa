import { SerializedResource } from '../../../data'
import config from '../../../src/config'

const topicsResources: Array<[string, SerializedResource[]]> =
  config.paths.topics.map((topicName) => [
    topicName,
    require(`../../../data/resources/json/${topicName}.json`),
  ])

const checkResourceHealth = (resource: SerializedResource) => {
  // checking if it is a downloadable resource
  // so far only PDFs
  if (resource.url.match(/\.pdf$/)) {
    return cy.checkHealthByBinaryRequest(resource)
  }

  const host = new URL(resource.url).hostname.replace(/^www./, '')

  switch (host) {
    case 'youtube.com':
      // skipping consent check page
      // TODO: evaluate using youtube apis instead?
      cy.setCookie('CONSENT', 'YES+cb.20220215-09-p0.en-GB+F+903', {
        domain: '.youtube.com',
      })
      return cy.checkHealthByUrlRequest(resource)
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
    case 'snipcart.com':
      return cy.checkHealthByVisit(resource)
    case 'reactdigest.net':
    case 'data-flair.training':
    case 'codepen.io':
    case 'replit.com':
    case 'git.herrbischoff.com':
    case 'linux.org':
    case 'bash.cyberciti.biz':
    case 'codementor.io':
      return cy.checkHealthByScraperRequest(resource, {
        apikey: Cypress.env('ZENSCRAPE_API_KEY'),
      })
    case 'tooltester.com':
    case 'regexr.com':
      return cy.checkHealthByScraperRequest(resource, {
        apikey: Cypress.env('ZENSCRAPE_API_KEY'),
        render: true,
      })
    case 'adobe.com':
    case 'ui.dev':
    case 'developer.apple.com':
    case 'udemy.com':
    case 'pexels.com':
      return cy.checkHealthByScraperRequest(resource, {
        apikey: Cypress.env('ZENSCRAPE_API_KEY'),
        premium: true,
      })
    default:
      return cy.checkHealthByUrlRequest(resource)
  }
}

describe('Resources', () => {
  describe('Duplicated resources', () => {
    topicsResources.reduce((uniqueResources, [topicName, topicResources]) => {
      topicResources.forEach((topicResource) => {
        if (uniqueResources[topicResource.url]) {
          it(`${topicName} "${topicResource.title}" [ ${topicResource.url} ] data should be the same in all duplicates`, () => {
            expect(topicResource).to.deep.equal(
              uniqueResources[topicResource.url],
            )
          })
        } else {
          uniqueResources[topicResource.url] = topicResource
        }
      })
      return uniqueResources
    }, {} as Record<SerializedResource['url'], SerializedResource>)
  })

  describe('Health check', () => {
    topicsResources.forEach(([topicName, topicResources]) => {
      describe(`${topicName} resources`, () => {
        topicResources.forEach((resource) => {
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
  })
})
