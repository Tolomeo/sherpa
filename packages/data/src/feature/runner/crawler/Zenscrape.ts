import type { CheerioAPI } from 'cheerio'
import type { ZenscrapeHealthcheckRunConfig } from '../../../../types'
import { wait } from '../../../common/defer'
import { FeatureCrawler, BasicCrawler, cheerio } from './common'
import type { BasicCrawlerOptions, BasicCrawlingContext } from './common'

type ZenscrapeCrawlingContext =
  BasicCrawlingContext<ZenscrapeHealthcheckRunConfig>

export interface ZenscrapeCrawlerResult {
  htmlDom: CheerioAPI
}

export default class ZenscrapeCrawler extends FeatureCrawler<
  BasicCrawler<ZenscrapeCrawlingContext>,
  ZenscrapeCrawlerResult,
  ZenscrapeHealthcheckRunConfig
> {
  constructor(crawlerOptions: BasicCrawlerOptions<ZenscrapeCrawlingContext>) {
    super(
      new BasicCrawler<ZenscrapeCrawlingContext>({
        ...crawlerOptions,
        retryOnBlocked: true,
        maxConcurrency: 1,
        sameDomainDelaySecs: 5,
        maxRequestRetries: 6,
        requestHandler: (...args) => this.requestHandler(...args),
        failedRequestHandler: (...args) => this.failedRequestHandler(...args),
      }),
    )
  }

  getDataRequestUrl(url: string, render: boolean, premium: boolean) {
    let dataRequestUrl = `https://app.zenscrape.com/api/v1/get?url=${encodeURIComponent(
      url,
    )}`

    // apparently the scraper api doesn't accept 'false' as valid qs parameter
    // so we can only pass 'true' or omit the url parameter entirely
    if (render) {
      dataRequestUrl = `${dataRequestUrl}&render=true`
    }

    if (premium) {
      dataRequestUrl = `${dataRequestUrl}&premium=true`
    }

    return dataRequestUrl
  }

  async requestHandler({ request, sendRequest }: ZenscrapeCrawlingContext) {
    const { ZENSCRAPE_API_KEY: apiKey } = import.meta.env

    if (!apiKey) {
      this.failure(request, new Error(`Zenscrape api key not found`))
      request.noRetry = true
      return
    }

    // const { titleSelector, render, premium } = request.userData
    const { render, premium } = request.userData
    const dataRequestUrl = this.getDataRequestUrl(request.url, render, premium)
    const { statusCode, body } = (await sendRequest({
      url: dataRequestUrl,
      headers: { apiKey },
    })) as { body: string; statusCode: number }

    if (statusCode === 429) {
      await wait(5000)
      throw new Error(`Concurrent requests are not supported`)
    }

    const $ = cheerio.load(body)
    /* const title = $(titleSelector).text().trim()

    if (!title) {
      this.failure(
        request,
        new Error(
          `Could not retrieve ${titleSelector} text from ${this.formatHTML(
            body,
          )}`,
        ),
      )
      return
    } */

    this.success(request, { htmlDom: $ })
  }

  failedRequestHandler({ request }: ZenscrapeCrawlingContext, error: Error) {
    this.failure(request, error)
  }
}
