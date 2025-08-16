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
import type {
  HtmlMetadata,
  PDFMetadata,
  UdemyMetadata,
  YoutubeAPIV3Metadata,
} from './scraper'
import {
  getHtmlMetadata,
  getPDFMetdadata,
  getYoutubeDataAPIV3Metadata,
  getUdemyMetadata,
} from './scraper'

type Crawler =
  | PdfFileCrawler
  | HttpCrawler
  | E2ECrawler
  | ZenscrapeCrawler
  | YoutubeDataApiCrawler
  | UdemyAffiliateApiCrawler

type FeatureExtractionData =
  | {
      source: 'PDFFile'
      metadata: PDFMetadata
    }
  | {
      source: 'HTML'
      metadata: HtmlMetadata
    }
  | { source: 'YoutubeDataAPIV3'; metadata: YoutubeAPIV3Metadata }
  | {
      source: 'UdemyAffiliateAPI'
      metadata: UdemyMetadata
    }

type FeatureExtractionResult =
  | {
      success: false
      error: Error
    }
  | {
      success: true
      data: FeatureExtractionData
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

  private success(data: FeatureExtractionData) {
    return {
      success: true as const,
      data,
    }
  }

  private error(err: Error) {
    return {
      success: false as const,
      error: err,
    }
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
          const metadata = await getPDFMetdadata({ url, buffer: result.file })

          return this.success({
            source: 'PDFFile',
            metadata,
          })
        }
        case 'Http': {
          const crawler = await this.getCrawler(HttpCrawler)
          const { dom } = await crawler.run(url, strategy.config)
          const metadata = await getHtmlMetadata({ url, source: dom })

          return this.success({
            source: 'HTML',
            metadata,
          })
        }
        case 'E2E': {
          const crawler = await this.getCrawler(E2ECrawler)
          const { html } = await crawler.run(url, strategy.config)
          const metadata = await getHtmlMetadata({ url, source: html })

          return this.success({
            source: 'HTML',
            metadata,
          })
        }
        case 'YoutubeData': {
          const crawler = await this.getCrawler(YoutubeDataApiCrawler)
          const result = await crawler.run(url, {})
          const metadata = getYoutubeDataAPIV3Metadata({
            url,
            response: result.response,
          })

          return this.success({
            source: 'YoutubeDataAPIV3',
            metadata,
          })
        }
        case 'Zenscrape': {
          const crawler = await this.getCrawler(ZenscrapeCrawler)
          const { htmlDom } = await crawler.run(url, strategy.config)
          const metadata = await getHtmlMetadata({ url, source: htmlDom })

          return this.success({
            source: 'HTML',
            metadata,
          })
        }
        case 'UdemyAffiliate': {
          const crawler = await this.getCrawler(UdemyAffiliateApiCrawler)
          const { response } = await crawler.run(url, {})
          const metadata = getUdemyMetadata({
            url,
            response,
          })

          return this.success({
            source: 'UdemyAffiliateAPI',
            metadata,
          })
        }
      }
    } catch (err) {
      return this.error(err as Error)
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
