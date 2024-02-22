/* eslint-disable @typescript-eslint/no-non-null-assertion -- several indirect accesses force to null-assert */
import { PlaywrightCrawler } from 'crawlee'
import type {
  PlaywrightCrawlerOptions,
  PlaywrightCrawlingContext,
} from 'crawlee'
import formatHTML from 'html-format'
import HealthCheckRunner from './Runner'

export interface E2EHealthCheckRequestData {
  titleSelector: string
  // https://playwright.dev/docs/api/class-page#page-wait-for-load-state
  waitForLoadState: 'load' | 'domcontentloaded' | 'networkidle'
}

export default class E2EHealthCheckRunner extends HealthCheckRunner<
  PlaywrightCrawler,
  E2EHealthCheckRequestData
> {
  constructor(crawlerOptions: Partial<PlaywrightCrawlerOptions>) {
    super()
    this.crawler = new PlaywrightCrawler({
      ...crawlerOptions,
      keepAlive: true,
      retryOnBlocked: true,
      requestHandler: this.requestHandler.bind(this),
      failedRequestHandler: this.failedRequestHandler.bind(this),
    })
  }

  async requestHandler({
    page,
    request,
  }: PlaywrightCrawlingContext<E2EHealthCheckRequestData>) {
    const {
      userData: { titleSelector, waitForLoadState },
    } = request

    await page.waitForLoadState(waitForLoadState)
    const title = await page.locator(titleSelector).first().textContent()

    if (!title) {
      const pageContent = await page.content()

      this.failure(
        request,
        new Error(
          `Could not retrieve ${titleSelector} text from ${formatHTML(
            pageContent,
          )}`,
        ),
      )

      return
    }

    this.success(request, { title })
  }

  failedRequestHandler(
    { request }: PlaywrightCrawlingContext<E2EHealthCheckRequestData>,
    error: Error,
  ) {
    this.failure(request, error)
  }
}
