import createMetascraper from 'metascraper'
import type { HtmlMetadata } from '../../../schema'
import type { DOM } from '../../common/html'
import { getDom } from '../../common/html'
import createMetascraperTitleRules from './title'
import createMetascraperAuthorRules from './author'
import createPublisherAuthorRules from './publisher'
import createDateRules from './date'

const metascraper = createMetascraper([
  createMetascraperTitleRules(),
  createMetascraperAuthorRules(),
  createPublisherAuthorRules(),
  createDateRules(),
])

const nullable = <T>(value: T) => value || null

interface GetHtmlMetadataOptions {
  url: string
  source: DOM | string
}

export const getHtmlMetadata = async ({
  url,
  source,
}: GetHtmlMetadataOptions) => {
  const htmlDom = typeof source === 'string' ? getDom(source) : source
  const {
    // title
    documentTitle,
    displayTitle,
    openGraphTitle,
    twitterTitle,
    jsonldTitle,
    // author
    documentAuthor,
    openGraphAuthor,
    microdataAuthor,
    jsonldAuthor,
    displayAuthor,
    // publisher
    jsonldPublisher,
    documentPublisher,
    openGraphPublisher,
    twitterPublisher,
    displayPublisher,
    domainPublisher,
    // date
    documentDate,
    displayDate,
    // published date
    jsonldDatePublished,
    openGraphDatePublished,
    microdataDatePublished,
    displayDatePublished,
    // modified date
    jsonldDateModified,
    openGraphDateModified,
    microdataDateModified,
    // TODO: infer returned keys from rules
  } = await metascraper({
    url,
    htmlDom,
  })

  const htmlMetadata: HtmlMetadata = {
    title: {
      document: nullable(documentTitle),
      display: nullable(displayTitle),
      openGraph: nullable(openGraphTitle),
      twitter: nullable(twitterTitle),
      jsonld: nullable(jsonldTitle),
    },
    author: {
      document: nullable(documentAuthor),
      display: nullable(displayAuthor),
      openGraph: nullable(openGraphAuthor),
      microdata: nullable(microdataAuthor),
      jsonld: nullable(jsonldAuthor),
    },
    publisher: {
      jsonld: nullable(jsonldPublisher),
      document: nullable(documentPublisher),
      openGraph: nullable(openGraphPublisher),
      twitter: nullable(twitterPublisher),
      display: nullable(displayPublisher),
      domain: nullable(domainPublisher),
    },
    date: {
      document: nullable(documentDate),
      display: nullable(displayDate),
    },
    publishedDate: {
      jsonld: nullable(jsonldDatePublished),
      openGraph: nullable(openGraphDatePublished),
      microdata: nullable(microdataDatePublished),
      display: nullable(displayDatePublished),
    },
    modifiedDate: {
      jsonld: nullable(jsonldDateModified),
      openGraph: nullable(openGraphDateModified),
      microdata: nullable(microdataDateModified),
    },
  }

  return htmlMetadata
}
