/// <reference types="cypress" />
import { SerializedResource } from '../../data'

type CheckHealthOptions = {
  titleSelector?: string
}

declare global {
  namespace Cypress {
    interface Chainable {
      checkHealthByVisit(
        value: SerializedResource,
        options?: CheckHealthOptions,
      ): void

      checkHealthByUrlRequest(
        value: SerializedResource,
        options?: CheckHealthOptions,
      ): void

      checkHealthByBinaryRequest(value: SerializedResource): void

      checkHealthByYoutubeDataAPIv3Request(
        value: SerializedResource,
        options: { apikey: string },
      ): void

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

// NB: this type contains only what we are checking for in the response, when we pass 'snippet' as value for 'part' query parameter
// the actual response is richer
type YoutubeDataApiResponse = {
  items: Array<{
    snippet: {
      title: string
    }
  }>
  pageInfo: {
    totalResults: number
  }
}

const checkHealthByYoutubeDataAPIv3Request = (
  resource: SerializedResource,
  { apikey }: { apikey: string },
) => {
  const { host, pathname, searchParams } = new URL(resource.url)
  let resourceType: string
  let id: string

  switch (true) {
    case host === 'www.youtube.com' && pathname === '/playlist':
      resourceType = 'playlists'
      id = searchParams.get('list')!
      break
    case host === 'www.youtube.com' && pathname === '/watch':
      resourceType = 'videos'
      id = searchParams.get('v')!
      break
    default:
      return expect.fail(
        `The resource url ${resource.url} is not recognizable as a valid video or playlist youtube url`,
      )
  }

  const url = `https://youtube.googleapis.com/youtube/v3/${resourceType}?id=${id}&key=${apikey}&part=snippet`

  cy.request<YoutubeDataApiResponse>({
    url,
    log: false,
  }).then((response) => {
    expect(response.body.pageInfo.totalResults).eql(
      1,
      `No ${resourceType} found matching the ${id} id`,
    )
    expect(response.body.items[0].snippet.title).to.contain(resource.title)
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
Cypress.Commands.add(
  'checkHealthByYoutubeDataAPIv3Request',
  checkHealthByYoutubeDataAPIv3Request,
)
Cypress.Commands.add('checkHealthByScraperRequest', checkHealthByScraperRequest)
