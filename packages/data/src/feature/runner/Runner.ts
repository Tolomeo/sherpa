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

  async run(url: string, strategy: HealthcheckStrategy) {
    let runner: Crawler

    switch (strategy.runner) {
      case 'PdfFile':
        runner = await this.getCrawler(PdfFileCrawler)
        return runner.run(url, {})
      case 'Http':
        runner = await this.getCrawler(HttpCrawler)
        return runner.run(url, strategy.config)
      case 'E2E':
        runner = await this.getCrawler(E2ECrawler)
        return runner.run(url, strategy.config)
      case 'YoutubeData':
        runner = await this.getCrawler(YoutubeDataApiCrawler)
        return runner.run(url, {})
      case 'Zenscrape':
        runner = await this.getCrawler(ZenscrapeCrawler)
        return runner.run(url, strategy.config)
      case 'UdemyAffiliate':
        runner = await this.getCrawler(UdemyAffiliateApiCrawler)
        return runner.run(url, {})
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
