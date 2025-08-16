import type { CheerioAPI } from 'cheerio'
import { load } from 'cheerio'
import createMetascraper from 'metascraper'
import createMetascraperTitleRules from './title'

const metascraper = createMetascraper([createMetascraperTitleRules()])

export interface HtmlMetadata {
  title: {
    document: string | null
    display: string | null
    og: string | null
    twitter: string | null
    jsonld: string | null
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
  const { document, display, og, twitter, jsonld } = await metascraper({
    url,
    htmlDom,
  })

  // TODO: improve HtmlMetadata inferred
  return {
    title: {
      document,
      display,
      og,
      twitter,
      jsonld,
    },
  } as HtmlMetadata
}
