import { randomUUID } from 'node:crypto'
import type { HealthcheckStrategy } from '../../../types/healthcheck'
import type { Constructor } from './crawler'
import {
  PdfFileCrawler,
  HttpCrawler,
  E2ECrawler,
  ZenscrapeCrawler,
  YoutubeDataApiCrawler,
  UdemyAffiliateApiCrawler,
  RequestQueue,
} from './crawler'
import {
  fromHtmlDom,
  fromHtmlString,
  fromPDFBuffer,
  fromYoutubeDataAPIV3Response,
  fromUdemyaffiliateApiResponse,
} from './scraper'

type Crawler =
  | PdfFileCrawler
  | HttpCrawler
  | E2ECrawler
  | ZenscrapeCrawler
  | YoutubeDataApiCrawler
  | UdemyAffiliateApiCrawler

type FeatureExtractionResult =
  | {
      success: false
      error: Error
    }
  | {
      success: true
      result: {
        title?: string
        documentTitle?: string
        metadataTitle?: string
        displayTitle?: string
      }
    }

class FeatureExtractionRunner {
  private runners = new Map<Constructor<Crawler>, Crawler>()

  async getCrawler<R extends Crawler>(Runner: Constructor<R>): Promise<R> {
    const runner = this.runners.get(Runner)

    if (runner) return runner as R

    const requestQueue = await RequestQueue.open(randomUUID())
    const runnerInstance = new Runner({ requestQueue })
    this.runners.set(Runner, runnerInstance)
    return runnerInstance
  }

  async run(
    url: string,
    strategy: HealthcheckStrategy,
  ): Promise<FeatureExtractionResult> {
    try {
      switch (strategy.runner) {
        case 'PdfFile': {
          const crawler = await this.getCrawler(PdfFileCrawler)
          const result = await crawler.run(url, {})

          return {
            success: true,
            result: await fromPDFBuffer({ url, buffer: result.file }),
          }
        }
        case 'Http': {
          const crawler = await this.getCrawler(HttpCrawler)
          const result = await crawler.run(url, strategy.config)

          return {
            success: true,
            result: await fromHtmlDom({ url, dom: result.dom }),
          }
        }
        case 'E2E': {
          const crawler = await this.getCrawler(E2ECrawler)
          const result = await crawler.run(url, strategy.config)

          return {
            success: true,
            result: await fromHtmlString({ url, html: result.html }),
          }
        }
        case 'YoutubeData': {
          const crawler = await this.getCrawler(YoutubeDataApiCrawler)
          const result = await crawler.run(url, {})

          return {
            success: true,
            result: fromYoutubeDataAPIV3Response({
              url,
              response: result.response,
            }),
          }
        }
        case 'Zenscrape': {
          const crawler = await this.getCrawler(ZenscrapeCrawler)
          const result = await crawler.run(url, strategy.config)

          return {
            success: true,
            result: await fromHtmlDom({ url, dom: result.htmlDom }),
          }
        }
        case 'UdemyAffiliate': {
          const crawler = await this.getCrawler(UdemyAffiliateApiCrawler)
          const result = await crawler.run(url, {})

          return {
            success: true,
            result: fromUdemyaffiliateApiResponse({
              url,
              response: result.response,
            }),
          }
        }
      }
    } catch (err) {
      return {
        success: false,
        error: err as Error,
      }
    }
  }

  async teardown() {
    const runnersTeardown = Object.values(this.runners).map((runner: Crawler) =>
      runner.teardown(),
    )
    await Promise.all(runnersTeardown)

    this.runners.clear()
  }
}

export default FeatureExtractionRunner
