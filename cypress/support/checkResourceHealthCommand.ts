/// <reference types="cypress" />
import { Resource } from '../../data'

declare global {
  namespace Cypress {
    interface Chainable {
      checkHealthByVisit(value: Resource): void

      checkHealthByUrlRequest(value: Resource): void

      checkHealthByBinaryRequest(value: Resource): void

      checkHealthByScraperRequest(
        value: Resource,
        options: { apikey: string; render?: boolean },
      ): void
    }
  }
}

const cleanTitleString = (str: string) =>
  Object.entries({
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&shy;': '',
    '&nbsp;': ' ',
  })
    .reduce((_str, [entity, replacement]) => {
      return _str.replace(new RegExp(entity, 'gi'), replacement)
    }, str)
    // cleaning any possible additional bothering special chars filtering by character code
    .split('')
    .filter((char) => {
      // 173 is soft wrap (equivalent of &shy;)
      return ![173].includes(char.charCodeAt(0))
    })
    .join('')

const checkHealthByVisit = (resource: Resource) => {
  cy.visit(resource.url, { headers: { Referer: resource.url } })
  cy.get('title').should(($title) => {
    const titleText = cleanTitleString($title.text())
    return expect(titleText).to.contain(resource.title)
  })
}

const checkHealthByUrlRequest = (resource: Resource) => {
  cy.request(resource.url).then((response) => {
    const document = new DOMParser().parseFromString(response.body, 'text/html')

    // if we received the document title in the response we validate against that
    if (document.title) {
      const titleText = cleanTitleString(document.title)
      return expect(titleText).to.contain(resource.title)
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

const checkHealthByScraperRequest = (
  resource: Resource,
  { apikey, render = false }: { apikey: string; render?: boolean },
) => {
  let url = `https://app.zenscrape.com/api/v1/get?url=${encodeURIComponent(
    resource.url,
  )}`

  if (render) {
    url = `${url}&render=true`
  }

  // waiting for enough time to avoid 429 error (too many concurrent requests)
  cy.wait(1000)

  cy.request({
    url,
    headers: {
      apikey,
    },
    log: false,
  }).then((response) => {
    const document = new DOMParser().parseFromString(response.body, 'text/html')

    return expect(cleanTitleString(document.title)).to.contain(resource.title)
  })
}

Cypress.Commands.add('checkHealthByVisit', checkHealthByVisit)
Cypress.Commands.add('checkHealthByUrlRequest', checkHealthByUrlRequest)
Cypress.Commands.add('checkHealthByBinaryRequest', checkHealthByBinaryRequest)
Cypress.Commands.add('checkHealthByScraperRequest', checkHealthByScraperRequest)
