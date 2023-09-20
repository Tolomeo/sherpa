/// <reference types="cypress" />
import { SerializedResource } from '../../data'

type CheckHealthOptions = {
  titleSelector?: string
}

declare global {
  namespace Cypress {
    interface Chainable {
      checkHealthByVisit(value: SerializedResource, options?: CheckHealthOptions): void

      checkHealthByUrlRequest(
        value: SerializedResource,
        options?: CheckHealthOptions,
      ): void

      checkHealthByBinaryRequest(value: SerializedResource): void

      checkHealthByScraperRequest(
        value: SerializedResource,
        options: CheckHealthOptions & {
          apikey: string
          render?: boolean
          premium?: boolean
        },
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

const checkHealthByUrlRequest = (
  resource: SerializedResource,
  { titleSelector = 'title' }: CheckHealthOptions = {},
) => {
  cy.request(resource.url).then((response) => {
    const document = new DOMParser().parseFromString(response.body, 'text/html')
    const titleElement = document.querySelector(titleSelector)
    const titleElementText = cleanTitleString(titleElement?.textContent || '')

    // if we received the document title in the response we validate against that
    if (titleElementText) {
      return expect(titleElementText).to.contain(resource.title)
    }

    // if we didn't receive the title in the response body
    // maybe it's a SPA and the title gets filled after the first render
    // so we visit the url and try
    return checkHealthByVisit(resource, { titleSelector })
  })
}

const checkHealthByVisit = (
  resource: SerializedResource,
  { titleSelector = 'title' }: CheckHealthOptions = {},
) => {
  cy.visit(resource.url, { headers: { Referer: resource.url } })
  cy.get(titleSelector).should(($title) => {
    const titleText = cleanTitleString($title.text())
    return expect(titleText).to.contain(resource.title)
  })
}

const checkHealthByBinaryRequest = (resource: SerializedResource) => {
  cy.request({
    url: resource.url,
    encoding: 'binary',
  })
}

const checkHealthByScraperRequest = (
  resource: SerializedResource,
  {
    titleSelector = 'title',
    apikey,
    render = false,
    premium = false,
  }: CheckHealthOptions & {
    apikey: string
    render?: boolean
    premium?: boolean
  },
) => {
  let url = `https://app.zenscrape.com/api/v1/get?url=${encodeURIComponent(
    resource.url,
  )}`

  if (render) {
    url = `${url}&render=true`
  }

  if (premium) {
    url = `${url}&premium=true`
  }

  // waiting for enough time to avoid 429 error (too many concurrent requests)
  cy.wait(1000)

  cy.request({
    url,
    headers: {
      apikey,
    },
    log: false,
    // longer timeout to make sure the request process ends on the scraper side
    // before possibly calling the service again
    timeout: 60000,
  }).then((response) => {
    const document = new DOMParser().parseFromString(response.body, 'text/html')
    const titleElement = document.querySelector(titleSelector)
    const titleElementText = cleanTitleString(titleElement?.textContent || '')

    return expect(titleElementText).to.contain(resource.title)
  })
}

Cypress.Commands.add('checkHealthByVisit', checkHealthByVisit)
Cypress.Commands.add('checkHealthByUrlRequest', checkHealthByUrlRequest)
Cypress.Commands.add('checkHealthByBinaryRequest', checkHealthByBinaryRequest)
Cypress.Commands.add('checkHealthByScraperRequest', checkHealthByScraperRequest)
