import type { CheerioAPI } from 'cheerio'
import { load } from 'cheerio'
import createMetascraper from 'metascraper'
import createMetascraperTitleRules from './title'

const metascraper = createMetascraper([createMetascraperTitleRules()])

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
  const { documentTitle, displayTitle, ogTitle, twitterTitle, jsonldTitle } =
    await metascraper({
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
  } as HtmlMetadata
}
