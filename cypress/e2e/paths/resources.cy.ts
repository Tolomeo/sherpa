import { paths, Resource } from '../../../data'

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
      return cy.checkHealthByVisit(resource)
    case 'tooltester.com':
    case 'ui.dev':
    case 'reactdigest.net':
    case 'data-flair.training':
    case 'regexr.com':
    case 'developer.apple.com':
    case 'udemy.com':
    case 'codepen.io':
      return cy.checkHealthByScraperRequest(resource, {
        apikey: Cypress.env('ZENSCRAPE_API_KEY'),
      })
    case 'pexels.com':
      return cy.checkHealthByScraperRequest(resource, {
        apikey: Cypress.env('ZENSCRAPE_API_KEY'),
        render: true,
      })
    default:
      return cy.checkHealthByUrlRequest(resource)
  }
}

describe('Resources', () => {
  Object.entries(paths).forEach(([_, path]) => {
    describe(`"${path.title}" path resources`, () => {
      path.main.forEach((pathResource) => {
        // this event will automatically be unbound when this test ends
        // returning false here prevents Cypress from
        // failing the test when an uncaught exception is thrown by the resource page
        cy.on('uncaught:exception', () => false)

        it(`"${pathResource.title}" [ ${pathResource.url} ]`, () => {
          checkResourceHealth(pathResource)
        })
      })
    })

    describe(`"${path.title}" additional resources`, () => {
      path.other.forEach((pathExtra) => {
        describe(`"${pathExtra.title}" additional resources`, () => {
          pathExtra.other.forEach((pathExtraResource) => {
            it(`"${pathExtraResource.title}" [ ${pathExtraResource.url} ]`, () => {
              // this event will automatically be unbound when this test ends
              // returning false here prevents Cypress from
              // failing the test when an uncaught exception is thrown by the resource page
              cy.on('uncaught:exception', () => false)

              checkResourceHealth(pathExtraResource)
            })
          })
        })
      })
    })
  })
})
