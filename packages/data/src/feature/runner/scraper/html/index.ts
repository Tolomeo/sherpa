import type { CheerioAPI } from 'cheerio'
import { load } from 'cheerio'
import createMetascraper from 'metascraper'
import createMetascraperTitleRules from './title'
import createMetascraperAuthorRules from './author'

const metascraper = createMetascraper([
  createMetascraperTitleRules(),
  createMetascraperAuthorRules(),
])

type Nullable<T> = T | null

const nullable = <T>(value: T) => value || null

export interface HtmlMetadata {
  title: {
    document: Nullable<string>
    display: Nullable<string>
    og: Nullable<string>
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
    ogTitle,
    twitterTitle,
    jsonldTitle,
    // author
    documentAuthor,
    openGraphAuthor,
    microdataAuthor,
    jsonldAuthor,
    displayAuthor,
  } = await metascraper({
    url,
    htmlDom,
  })

  // TODO: improve HtmlMetadata inferred
  return {
    title: {
      document: nullable(documentTitle),
      display: nullable(displayTitle),
      og: nullable(ogTitle),
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
  } as HtmlMetadata
}
