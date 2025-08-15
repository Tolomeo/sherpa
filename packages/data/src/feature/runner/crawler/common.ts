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

export {
  BasicCrawler,
  CheerioCrawler,
  PlaywrightCrawler,
  RequestQueue,
} from 'crawlee'

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
      success: true
      url: string
      error: null
      data: ScrapeResult
    }
  | {
      success: false
      url: string
      error: Error
      data: null
    }

const scrapeMetadata = scraper.scrape

type Crawler = Pick<
  BasicCrawler,
  'running' | 'run' | 'requestQueue' | 'addRequests' | 'teardown'
>

type CrawlerResult<O> =
  | {
      success: true
      url: string
      data: O
    }
  | {
      success: false
      url: string
      error: Error
    }

export abstract class FeatureCrawler<
  C extends Crawler,
  O extends Dictionary,
  I extends Dictionary = Dictionary,
> {
  protected results = new Map<string, Deferred<CrawlerResult<O>>>()

  protected crawler: C

  protected constructor(crawler: C) {
    this.crawler = crawler
  }

  protected success(request: Request<I>, data: O) {
    this.results.get(request.url)?.resolve({
      url: request.url,
      success: true,
      data,
    })
  }

  protected failure(request: Request<I>, error: Error) {
    this.results.get(request.url)?.resolve({
      url: request.url,
      success: false,
      error,
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

  async run(url: string, userData: I) {
    const result = this.results.get(url)

    if (result) return result.promise

    const deferred = new Deferred<CrawlerResult<O>>()
    this.results.set(url, deferred)

    const request = new Request<I>({ url, userData })
    await this.crawler.addRequests([request]).catch(console.error)
    !this.crawler.running && this.crawler.run().catch(console.error)

    return deferred
  }
}
