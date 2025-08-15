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

/* type FeatureExtractionResult =
  | {
      success: false
      error: Error
    }
  | {
      success: true
      data: {
        title?: string
        documentTitle?: string
        metadataTitle?: string
        displayTitle?: string
      }
    } */

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

  async run(url: string, strategy: HealthcheckStrategy) {
    switch (strategy.runner) {
      case 'PdfFile': {
        const runner = await this.getCrawler(PdfFileCrawler)
        const result = await runner.run(url, {})

        if (!result.success) {
          return result
        }

        return {
          success: true,
          data: await fromPDFBuffer({ url, buffer: result.data.file }),
        }
      }
      case 'Http': {
        const runner = await this.getCrawler(HttpCrawler)
        const result = await runner.run(url, strategy.config)

        if (!result.success) {
          return result
        }

        return {
          success: true,
          data: await fromHtmlDom({ url, dom: result.data.htmlDom }),
        }
      }
      case 'E2E': {
        const runner = await this.getCrawler(E2ECrawler)
        const result = await runner.run(url, strategy.config)

        if (!result.success) {
          return result
        }

        return {
          success: true,
          data: fromHtmlString({ url, html: result.data.html }),
        }
      }
      case 'YoutubeData': {
        const runner = await this.getCrawler(YoutubeDataApiCrawler)
        const result = await runner.run(url, {})

        if (!result.success) {
          return result
        }

        return {
          success: true,
          data: fromYoutubeDataAPIV3Response({
            url,
            response: result.data.response,
          }),
        }
      }
      case 'Zenscrape': {
        const runner = await this.getCrawler(ZenscrapeCrawler)
        const result = await runner.run(url, strategy.config)

        if (!result.success) {
          return result
        }

        return {
          success: true,
          data: await fromHtmlDom({ url, dom: result.data.htmlDom }),
        }
      }
      case 'UdemyAffiliate': {
        const runner = await this.getCrawler(UdemyAffiliateApiCrawler)
        const result = await runner.run(url, {})

        if (!result.success) {
          return result
        }

        return {
          success: true,
          data: fromUdemyaffiliateApiResponse({
            url,
            response: result.data.response,
          }),
        }
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
