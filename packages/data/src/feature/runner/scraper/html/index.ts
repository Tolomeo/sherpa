import type { CheerioAPI } from 'cheerio'
import { load } from 'cheerio'
import createMetascraper from 'metascraper'
import createMetascraperTitleRules from './title'
import createMetascraperAuthorRules from './author'
import createPublisherAuthorRules from './publisher'

const metascraper = createMetascraper([
  createMetascraperTitleRules(),
  createMetascraperAuthorRules(),
  createPublisherAuthorRules(),
])

type Nullable<T> = T | null

const nullable = <T>(value: T) => value || null

export interface HtmlMetadata {
  title: {
    document: Nullable<string>
    display: Nullable<string>
    openGraph: Nullable<string>
    twitter: Nullable<string>
    jsonld: Nullable<string>
  }
  author: {
    document: Nullable<string>
    openGraph: Nullable<string>
    microdata: Nullable<string>
    jsonld: Nullable<string>
    display: Nullable<string>
  }
  publisher: {
    document: Nullable<string>
    jsonld: Nullable<string>
    openGraph: Nullable<string>
    twitter: Nullable<string>
    display: Nullable<string>
    domain: Nullable<string>
  }
}

interface GetHtmlMetadataOptions {
  url: string
  source: CheerioAPI | string
}

export const getHtmlMetadata = async ({
  url,
  source,
}: GetHtmlMetadataOptions) => {
  const htmlDom = typeof source === 'string' ? load(source) : source
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
  } = await metascraper({
    url,
    htmlDom,
  })

  // TODO: improve HtmlMetadata inferred
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
  }

  return htmlMetadata
}
