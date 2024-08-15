import type { ZenscrapeHealthcheckRunConfig } from '../../../types'
import { wait } from '../../common/defer'
import { HealthCheckRunner, BasicCrawler, cheerio } from './common'
import type { BasicCrawlerOptions, BasicCrawlingContext } from './common'

export default class ZenscrapeHealthCheckRunner extends HealthCheckRunner<BasicCrawler> {
  constructor(crawlerOptions: BasicCrawlerOptions) {
    super()
    this.crawler = new BasicCrawler({
      ...crawlerOptions,
      keepAlive: true,
      retryOnBlocked: true,
      maxConcurrency: 1,
      sameDomainDelaySecs: 5,
      maxRequestRetries: 6,
      requestHandler: this.requestHandler.bind(this),
      failedRequestHandler: this.failedRequestHandler.bind(this),
    })
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

  async requestHandler({
    request,
    sendRequest,
  }: BasicCrawlingContext<ZenscrapeHealthcheckRunConfig>) {
    const { ZENSCRAPE_API_KEY: apiKey } = import.meta.env

    if (!apiKey) {
      this.failure(request, new Error(`Zenscrape api key not found`))
      request.noRetry = true
      return
    }

    const { titleSelector, render, premium } = request.userData
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
    const title = $(titleSelector).text().trim()

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
    }

    this.success(request, { title: this.filterEntities(title) })
  }

  failedRequestHandler({ request }: BasicCrawlingContext, error: Error) {
    this.failure(request, error)
  }
}
