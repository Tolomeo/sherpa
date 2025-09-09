import type { CheerioAPI } from 'cheerio'
import { load } from 'cheerio'

export type HtmlDOM = CheerioAPI

export const getHtmlDom = (html: string) => load(html)
