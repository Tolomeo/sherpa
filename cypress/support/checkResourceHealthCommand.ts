/// <reference types="cypress" />
import { Resource } from '../../data'

declare global {
  namespace Cypress {
    interface Chainable {
      checkHealthByVisit(value: Resource): void

      checkHealthByUrlRequest(value: Resource): void

      checkHealthByBinaryRequest(value: Resource): void

      checkHealthByScraperRequest(value: Resource): void
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

const checkHealthByVisit = (resource: Resource) => {
  cy.visit(resource.url, { headers: { Referer: resource.url } })
  cy.get('title').should('contain.text', resource.title)
}

const checkHealthByUrlRequest = (resource: Resource) => {
  cy.request(resource.url).then((response) => {
    const document = new DOMParser().parseFromString(response.body, 'text/html')

    // if we received the document title in the response we validate against that
    if (document.title) {
      return expect(cleanHtmlEntities(document.title)).to.contain(
        resource.title,
      )
    }

    // if we didn't receive the title in the response body
    // maybe it's a SPA and the title gets filled after the first render
    // so we visit the url and try
    return checkHealthByVisit(resource)
  })
}

const checkHealthByBinaryRequest = (resource: Resource) => {
  cy.request({
    url: resource.url,
    encoding: 'binary',
  })
}

const checkHealthByScraperRequest = (resource: Resource) => {
  cy.request({
    url: `https://app.zenscrape.com/api/v1/get?url=${encodeURIComponent(
      resource.url,
    )}&render=true`,
    headers: {
      apikey: Cypress.env('ZENSCRAPE_API_KEY'),
    },
    log: false,
  }).then((response) => {
    const document = new DOMParser().parseFromString(response.body, 'text/html')

    return expect(cleanHtmlEntities(document.title)).to.contain(resource.title)
  })
}

Cypress.Commands.add('checkHealthByVisit', checkHealthByVisit)
Cypress.Commands.add('checkHealthByUrlRequest', checkHealthByUrlRequest)
Cypress.Commands.add('checkHealthByBinaryRequest', checkHealthByBinaryRequest)
Cypress.Commands.add('checkHealthByScraperRequest', checkHealthByScraperRequest)
