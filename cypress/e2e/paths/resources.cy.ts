import { Resource, resources } from '../../../data'

const checkResourceHealth = (resource: Resource) => {
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
      return cy.checkHealthByVisit(resource)
    case 'reactdigest.net':
    case 'data-flair.training':
    case 'regexr.com':
    case 'codepen.io':
      return cy.checkHealthByScraperRequest(resource, {
        apikey: Cypress.env('ZENSCRAPE_API_KEY'),
      })
    case 'tooltester.com':
    case 'adobe.com':
    case 'ui.dev':
      return cy.checkHealthByScraperRequest(resource, {
        apikey: Cypress.env('ZENSCRAPE_API_KEY'),
        render: true,
      })
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
  Object.values(resources).forEach((resource) => {
    it(`"${resource.title}" [ ${resource.url} ]`, () => {
      // this event will automatically be unbound when this test ends
      // returning false here prevents Cypress from
      // failing the test when an uncaught exception is thrown by the resource page
      cy.on('uncaught:exception', () => false)

      checkResourceHealth(resource)
    })
  })
})
