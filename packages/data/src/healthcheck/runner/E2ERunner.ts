import type { E2EHealthcheckRunConfig } from '../../../types'
import { HealthCheckRunner, PlaywrightCrawler } from './common'
import type {
  PlaywrightCrawlerOptions,
  PlaywrightCrawlingContext,
} from './common'

export default class E2EHealthCheckRunner extends HealthCheckRunner<
  PlaywrightCrawler,
  E2EHealthcheckRunConfig
> {
  constructor(crawlerOptions: Partial<PlaywrightCrawlerOptions>) {
    super()
    this.crawler = new PlaywrightCrawler({
      ...crawlerOptions,
      keepAlive: true,
      retryOnBlocked: true,
      // @ts-expect-error -- TODO revisit OO design
      requestHandler: this.requestHandler.bind(this),
      // @ts-expect-error -- TODO revisit OO design
      failedRequestHandler: this.failedRequestHandler.bind(this),
    })
  }

  async requestHandler({
    page,
    request,
  }: PlaywrightCrawlingContext<E2EHealthcheckRunConfig>) {
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
          `Could not retrieve ${titleSelector} text from ${this.formatHTML(
            pageContent,
          )}`,
        ),
      )

      return
    }

    this.success(request, { title: this.filterEntities(title) })
  }

  failedRequestHandler(
    { request }: PlaywrightCrawlingContext<E2EHealthcheckRunConfig>,
    error: Error,
  ) {
    this.failure(request, error)
  }
}
