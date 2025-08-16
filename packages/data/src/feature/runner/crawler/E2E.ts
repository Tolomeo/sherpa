import type { E2EHealthcheckRunConfig } from '../../../../types'
import type {
  PlaywrightCrawlerOptions,
  PlaywrightCrawlingContext,
} from './common'
import { FeatureCrawler, PlaywrightCrawler } from './common'

type E2ECrawlingContext = PlaywrightCrawlingContext<E2EHealthcheckRunConfig>

export interface PlaywrightCrawlerResult {
  html: string
}

export default class E2ECrawler extends FeatureCrawler<
  PlaywrightCrawler,
  PlaywrightCrawlerResult,
  E2EHealthcheckRunConfig
> {
  constructor(crawlerOptions: Partial<PlaywrightCrawlerOptions>) {
    super(
      new PlaywrightCrawler({
        ...crawlerOptions,
        retryOnBlocked: true,
        requestHandler: (context, ...args) =>
          this.requestHandler(context as E2ECrawlingContext, ...args),
        failedRequestHandler: (context, ...args) =>
          this.failedRequestHandler(context as E2ECrawlingContext, ...args),
      }),
    )
  }

  async requestHandler({ page, request }: E2ECrawlingContext) {
    /* const {
      userData: { titleSelector, waitForLoadState },
    } = request */
    const {
      userData: { waitForLoadState },
    } = request

    await page.waitForLoadState(waitForLoadState)

    const html = await page.content()

    this.success(request, { html })

    /* const title = await page.locator(titleSelector).first().textContent()

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

    this.success(request, { title: this.filterEntities(title) }) */
  }

  failedRequestHandler({ request }: E2ECrawlingContext, error: Error) {
    this.failure(request, error)
  }
}
