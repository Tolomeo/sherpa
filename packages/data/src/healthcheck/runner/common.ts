import { Request, RequestQueue } from 'crawlee'
import type {
  Constructor,
  Dictionary,
  CheerioCrawler,
  PlaywrightCrawler,
  BasicCrawler,
} from 'crawlee'
import { decode, encode } from 'he'
import formatHTML from 'html-format'
import { Deferred } from '../../common/defer'

export { type Constructor, RequestQueue }

export type HealthCheckResult =
  | {
      url: string
      success: true
      data: {
        title: string
      }
    }
  | {
      url: string
      success: false
      error: Error
    }

export abstract class HealthCheckRunner<
  C extends BasicCrawler | PlaywrightCrawler | CheerioCrawler,
  D extends Dictionary = Dictionary,
> {
  protected results = new Map<string, Deferred<HealthCheckResult>>()

  protected crawler: C

  protected success(request: Request<D>, data: { title: string }) {
    this.results.get(request.url)?.resolve({
      url: request.url,
      success: true,
      data,
    })
  }

  protected failure(request: Request<D>, error: Error) {
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

  async teardown() {
    await this.crawler.requestQueue?.drop()
    await this.crawler.teardown()
    this.results.clear()
  }

  async run(url: string, userData: D) {
    const result = this.results.get(url)

    if (result) return result.promise

    this.results.set(url, new Deferred())
    const request = new Request<D>({ url, userData })
    await this.crawler.addRequests([request]).catch(console.error)
    !this.crawler.running && this.crawler.run().catch(console.error)
    return this.results.get(url)!.promise
  }
}
