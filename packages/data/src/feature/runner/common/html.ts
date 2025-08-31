import type { CheerioAPI } from 'cheerio'
import { load } from 'cheerio'

export type DOM = CheerioAPI

export const getDom = (html: string) => load(html)
