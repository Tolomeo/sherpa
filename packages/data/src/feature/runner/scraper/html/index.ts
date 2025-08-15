import type { CheerioAPI } from 'cheerio'
import { load } from 'cheerio'
import createMetascraper, { type MetascraperOptions } from 'metascraper'
import createMetascraperTitleRules from './title'

export type HtmlScraperOptions = MetascraperOptions

const scraper = createMetascraper([createMetascraperTitleRules()])

export interface FromHtmlStringOptions {
  url: string
  html: string
}

export const fromHtmlString = ({ url, html }: FromHtmlStringOptions) =>
  scraper({ url, htmlDom: load(html) })

export interface FromHtmlDomOptions {
  url: string
  dom: CheerioAPI
}

export const fromHtmlDom = ({ url, dom }: FromHtmlDomOptions) =>
  scraper({ url, htmlDom: dom })
