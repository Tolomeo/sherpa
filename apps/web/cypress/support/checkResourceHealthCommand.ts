/* eslint-disable no-case-declarations */
import type { SerializedResource } from '@sherpa/data'
import { recurse } from 'cypress-recurse'

interface CheckHealthOptions {
  titleSelector?: string
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      checkHealthByVisit(_: SerializedResource, __?: CheckHealthOptions): void

      checkHealthByUrlRequest(
        _: SerializedResource,
        __?: CheckHealthOptions,
      ): void

      checkHealthByBinaryRequest(_: SerializedResource): void

      checkHealthByYoutubeDataAPIv3Request(
        _: SerializedResource,
        __: { apikey: string },
      ): void

      checkHealthByScraperRequest(
        _: SerializedResource,
        __: CheckHealthOptions & {
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
    const document = new DOMParser().parseFromString(
      response.body as string,
      'text/html',
    )
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
interface YoutubeDataApiResponse {
  items: {
    snippet: {
      title: string
    }
  }[]
  pageInfo: {
    totalResults: number
  }
}

const checkHealthByYoutubeDataAPIv3Request = (
  resource: SerializedResource,
  { apikey }: { apikey: string },
) => {
  const apiBaseUrl = 'https://youtube.googleapis.com/youtube/v3'
  let apiPath = ''

  const videoUrl = /^https?:\/\/www\.youtube\.com\/watch\?v=(\S+)$/
  const playlistUrl = /^https?:\/\/www\.youtube\.com\/playlist\?list=(\S+)$/
  const channelUrl = /^https?:\/\/www.youtube.com\/(?:@|c\/){1}(\S+)$/

  switch (true) {
    case videoUrl.test(resource.url):
      const [, videoId] = resource.url.match(videoUrl)!
      apiPath = `/videos?id=${videoId}`
      break
    case playlistUrl.test(resource.url):
      const [, playlistId] = resource.url.match(playlistUrl)!
      apiPath = `/playlists?id=${playlistId}`
      break
    case channelUrl.test(resource.url):
      const [, channelHandle] = resource.url.match(channelUrl)!
      // NB: youtube data api doesn't yet support retrieving channel's data by handle
      // therefore we are executing a channel search specifying the channel handle as query
      // see https://stackoverflow.com/a/74902789/3162406
      apiPath = `/search?q=%40${channelHandle}&type=channel`
      break
    default:
      return assert.fail(
        `The resource url ${resource.url} is not recognizable as a valid video, playlist or channel youtube url`,
      )
  }

  apiPath += `&key=${apikey}&part=snippet&maxResults=1`

  const requestUrl = `${apiBaseUrl}${apiPath}`

  cy.request<YoutubeDataApiResponse>({
    url: requestUrl,
    log: false,
  }).then((response) => {
    expect(response.body.pageInfo.totalResults).to.be.at.least(
      1,
      `Should find at least one match returned by the api`,
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
  // apparently the scraper api doesn't accept 'false' as valid qs parameter
  // so we can only pass 'true' or omit the url parameter entirely
  // that is why we are not using RequestOptions.qs here
  let url = `https://app.zenscrape.com/api/v1/get?url=${encodeURIComponent(
    resource.url,
  )}`
  if (render) {
    url = `${url}&render=true`
  }
  if (premium) {
    url = `${url}&premium=true`
  }

  const scraperRequest = () =>
    cy.request<string>({
      url,
      headers: {
        apikey,
      },
      failOnStatusCode: false,
    })
  const retryUntil = (request: Cypress.Response<string>) =>
    request.status !== 429

  // we are repeating the request up to  6 times, with a 5s delay between repetitions
  // to handle the api returning 429: Too many requests
  // which happens when we accidentally create concurrent requests in the scraping platform
  return recurse(scraperRequest, retryUntil, {
    timeout: 60000,
    delay: 5000,
    limit: 6,
  }).then((scraperResponse) => {
    expect(scraperResponse.status).within(
      200,
      399,
      `Scraping request returned ${scraperResponse.status}: ${
        scraperResponse.statusText
      }\n${JSON.stringify(scraperResponse, null, 2)}`,
    )

    const document = new DOMParser().parseFromString(
      scraperResponse.body,
      'text/html',
    )
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
