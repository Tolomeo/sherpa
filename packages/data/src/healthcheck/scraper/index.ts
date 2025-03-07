import createMetascraper, { type MetascraperOptions } from 'metascraper'
import createMetascraperTitleRules from './title'

const scrape = createMetascraper([createMetascraperTitleRules()])

export type ScrapeOptions = MetascraperOptions

export default {
  scrape,
}
