import type { CheerioAPI } from 'cheerio'
import { load } from 'cheerio'
import createMetascraper from 'metascraper'
import createMetascraperTitleRules from './title'

const metascraper = createMetascraper([createMetascraperTitleRules()])

export interface HtmlMetadata {
  title: {
    document?: string
    display?: string
    og?: string
    twitter?: string
    jsonld?: string
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
  const metadata = await metascraper({
    url,
    htmlDom,
  })

  return metadata as HtmlMetadata
}
