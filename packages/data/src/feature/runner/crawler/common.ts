import { Request } from 'crawlee'
import type { Dictionary, BasicCrawler } from 'crawlee'
// import formatHTML from 'html-format'
import { Deferred } from '../../../common/defer'

export type {
  Constructor,
  BasicCrawlerOptions,
  BasicCrawlingContext,
  CheerioCrawlerOptions,
  CheerioCrawlingContext,
  PlaywrightCrawlerOptions,
  PlaywrightCrawlingContext,
} from 'crawlee'

export type { CheerioAPI } from 'cheerio'

export {
  Configuration,
  BasicCrawler,
  CheerioCrawler,
  PlaywrightCrawler,
  RequestQueue,
} from 'crawlee'

export * as cheerio from 'cheerio'

export { fileTypeFromBuffer } from 'file-type'

export interface ScrapeResult {
  title?: string
  documentTitle?: string
  metadataTitle?: string
  displayTitle?: string
}

type Crawler = Pick<
  BasicCrawler,
  'running' | 'run' | 'requestQueue' | 'addRequests' | 'teardown'
>

export abstract class FeatureCrawler<
  C extends Crawler,
  O extends Dictionary,
  I extends Dictionary = Dictionary,
> {
  protected results = new Map<string, Deferred<O>>()

  protected crawler: C

  protected constructor(crawler: C) {
    this.crawler = crawler
  }

  protected success(request: Request<I>, data: O) {
    this.results.get(request.url)?.resolve(data)
  }

  protected failure(request: Request<I>, error: Error) {
    this.results.get(request.url)?.reject(error)
  }

  /* protected formatHTML(htmlString: string) {
    return formatHTML(htmlString)
  } */

  async teardown() {
    await this.crawler.requestQueue?.drop()
    await this.crawler.teardown()
    this.results.clear()
  }

  async run(url: string, userData: I) {
    const result = this.results.get(url)

    if (result) return result

    const deferred = new Deferred<O>()
    this.results.set(url, deferred)

    const request = new Request<I>({ url, userData })
    await this.crawler.addRequests([request]).catch(console.error)
    !this.crawler.running && this.crawler.run().catch(console.error)

    return deferred
  }
}
