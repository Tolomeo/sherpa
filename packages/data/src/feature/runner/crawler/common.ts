import { Request } from 'crawlee'
import type { Dictionary, BasicCrawler } from 'crawlee'
import he from 'he'
import formatHTML from 'html-format'
import { Deferred } from '../../../common/defer'
import scraper, { type ScrapeOptions } from '../scraper'

export type {
  Constructor,
  BasicCrawlerOptions,
  BasicCrawlingContext,
  CheerioCrawlerOptions,
  CheerioCrawlingContext,
  PlaywrightCrawlerOptions,
  PlaywrightCrawlingContext,
} from 'crawlee'

export { BasicCrawler, CheerioCrawler, PlaywrightCrawler } from 'crawlee'

export * as cheerio from 'cheerio'

export { fileTypeFromBuffer } from 'file-type'

const { decode, encode } = he

export interface ScrapeResult {
  title?: string
  documentTitle?: string
  metadataTitle?: string
  displayTitle?: string
}

export type HealthCheckResult =
  | {
      url: string
      success: true
      error: null
      data: ScrapeResult
    }
  | {
      url: string
      success: false
      error: Error
      data: null
    }

const scrapeMetadata = scraper.scrape

type Crawler = Pick<
  BasicCrawler,
  'running' | 'run' | 'requestQueue' | 'addRequests' | 'teardown'
>

export abstract class FeatureCrawler<
  C extends Crawler,
  D extends Dictionary = Dictionary,
> {
  protected results = new Map<string, Deferred<HealthCheckResult>>()

  protected crawler: C

  protected constructor(crawler: C) {
    this.crawler = crawler
  }

  protected success(request: Request<D>, data: ScrapeResult) {
    this.results.get(request.url)?.resolve({
      url: request.url,
      success: true,
      error: null,
      data,
    })
  }

  protected failure(request: Request<D>, error: Error) {
    this.results.get(request.url)?.resolve({
      url: request.url,
      success: false,
      error,
      data: null,
    })
  }

  protected formatHTML(htmlString: string) {
    return formatHTML(htmlString)
  }

  protected filterEntities(text: string) {
    const entities: Record<string, string> = {
      '&#xAD;': '',
    }
    const eEntities = new RegExp(Object.keys(entities).join('|'), 'g')

    return decode(encode(text).replace(eEntities, (entity) => entities[entity]))
  }

  protected getMetadata(options: ScrapeOptions) {
    return scrapeMetadata(options)
  }

  async teardown() {
    await this.crawler.requestQueue?.drop()
    await this.crawler.teardown()
    this.results.clear()
  }

  async run(url: string, userData: D) {
    const result = this.results.get(url)

    if (result) return result.promise

    const deferred = new Deferred<HealthCheckResult>()
    this.results.set(url, deferred)

    const request = new Request<D>({ url, userData })
    await this.crawler.addRequests([request]).catch(console.error)
    !this.crawler.running && this.crawler.run().catch(console.error)

    return deferred
  }
}
