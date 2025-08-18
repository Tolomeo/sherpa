import { randomUUID } from 'node:crypto'
import type { HealthcheckStrategy } from '../../../types/healthcheck'
import type {
  FeatureExtractionResultData,
  FeatureExtractionResultDetailData,
} from '../schema'
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
  getHtmlMetadata,
  getPdfMetadata,
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

  private success(url: string, detail: FeatureExtractionResultDetailData) {
    return {
      url,
      success: true as const,
      detail,
    }
  }

  private error(url: string, error: Error) {
    return {
      url,
      success: false as const,
      error: error.toString(),
    }
  }

  async run(
    url: string,
    strategy: HealthcheckStrategy,
  ): Promise<FeatureExtractionResultData> {
    try {
      switch (strategy.runner) {
        case 'PdfFile': {
          const crawler = await this.getCrawler(PdfFileCrawler)
          const { file } = await crawler.run(url, {})
          const metadata = await getPdfMetadata({ url, source: file })

          return this.success(url, {
            source: 'PdfFile',
            metadata,
          })
        }
        case 'Http': {
          const crawler = await this.getCrawler(HttpCrawler)
          const { dom } = await crawler.run(url, strategy.config)
          const metadata = await getHtmlMetadata({ url, source: dom })

          return this.success(url, {
            source: 'Html',
            metadata,
          })
        }
        case 'E2E': {
          const crawler = await this.getCrawler(E2ECrawler)
          const { html } = await crawler.run(url, strategy.config)
          const metadata = await getHtmlMetadata({ url, source: html })

          return this.success(url, {
            source: 'Html',
            metadata,
          })
        }
        case 'YoutubeData': {
          const crawler = await this.getCrawler(YoutubeDataApiCrawler)
          const result = await crawler.run(url, {})
          const metadata = getYoutubeDataAPIV3Metadata({
            url,
            source: result.response,
          })

          return this.success(url, {
            source: 'YoutubeDataAPIV3',
            metadata,
          })
        }
        case 'Zenscrape': {
          const crawler = await this.getCrawler(ZenscrapeCrawler)
          const { html } = await crawler.run(url, strategy.config)
          const metadata = await getHtmlMetadata({ url, source: html })

          return this.success(url, {
            source: 'Html',
            metadata,
          })
        }
        case 'UdemyAffiliate': {
          const crawler = await this.getCrawler(UdemyAffiliateApiCrawler)
          const { response } = await crawler.run(url, {})
          const metadata = getUdemyMetadata({
            url,
            source: response,
          })

          return this.success(url, {
            source: 'UdemyAffiliateAPI',
            metadata,
          })
        }
      }
    } catch (err) {
      return this.error(url, err as Error)
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
