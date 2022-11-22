/// <reference types="cypress" />
import { Resource } from '../../data'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Validates the health of a specified resource
       * @example cy.checkResourceHealth({ title: "Title of the resource", "url": "https://resource.com", "resource.com" })
       */
      checkResourceHealth(value: Resource): void
    }
  }
}

const cleanHtmlEntities = (str: string) =>
  Object.entries({
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&shy;': '',
    '&nbsp;': ' ',
  }).reduce((_str, [entity, replacement]) => {
    return _str.replace(new RegExp(entity, 'gi'), replacement)
  }, str)

const resourceCheckStrategy = {
  visit(resource: Resource) {
    cy.visit(resource.url, { headers: { Referer: resource.url } })
    cy.get('title').should('contain.text', resource.title)
  },
  request(resource: Resource) {
    cy.request(resource.url).then((response) => {
      const document = new DOMParser().parseFromString(
        response.body,
        'text/html',
      )

      // if we received the document title in the response we validate against that
      if (document.title) {
        return expect(cleanHtmlEntities(document.title)).to.contain(
          resource.title,
        )
      }

      // if we didn't receive the title in the response body
      // maybe it's a SPA and the title gets filled after the first render
      // so we visit the url and try
      return this.visit(resource)
    })
  },
  binary(resource: Resource) {
    cy.request({
      url: resource.url,
      encoding: 'binary',
    })
  },
  scraper(resource: Resource) {
    cy.request({
      url: `https://app.zenscrape.com/api/v1/get?url=${encodeURIComponent(
        resource.url,
      )}`,
      headers: {
        apikey: Cypress.env('ZENSCRAPE_API_KEY'),
      },
      log: false,
    }).then((response) => {
      const document = new DOMParser().parseFromString(
        response.body,
        'text/html',
      )

      return expect(cleanHtmlEntities(document.title)).to.contain(
        resource.title,
      )
    })
  },
}

const checkResourceHealth = (resource: Resource) => {
  // checking if it is a downloadable resource
  // so far only PDFs
  if (resource.url.match(/\.pdf$/)) {
    return resourceCheckStrategy.binary(resource)
  }

  const host = new URL(resource.url).hostname.replace(/^www./, '')

  switch (host) {
    case 'youtube.com':
      // skipping consent check page
      // TODO: evaluate using youtube apis instead?
      cy.setCookie('CONSENT', 'YES+cb.20220215-09-p0.en-GB+F+903', {
        domain: '.youtube.com',
      })
      return resourceCheckStrategy.request(resource)
    case 'thevaluable.dev':
    case 'usehooks-ts.com':
    case 'developer.ibm.com':
    case 'davrous.com':
    case 'zzapper.co.uk':
    case 'launchschool.com':
    case 'wattenberger.com':
    case 'gameaccessibilityguidelines.com':
    case 'testing-playground.com':
    case 'arsfutura.com':
    case 'tooltester.com':
    case 'developer.apple.com':
    case 'regexr.com':
    case 'pexels.com':
    case 'tooltester.com':
      return resourceCheckStrategy.visit(resource)
    case 'udemy.com':
    case 'codepen.io':
    case 'ui.dev':
    case 'reactdigest.net':
    case 'data-flair.training':
      return resourceCheckStrategy.scraper(resource)
    default:
      return resourceCheckStrategy.request(resource)
  }
}

Cypress.Commands.add('checkResourceHealth', checkResourceHealth)
