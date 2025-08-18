import type { BasicCrawlerOptions, BasicCrawlingContext } from './common'
import { FeatureCrawler, BasicCrawler } from './common'

export interface PdfFileCrawlerResult {
  file: Buffer
}

export default class PdfFileCrawler extends FeatureCrawler<
  BasicCrawler,
  PdfFileCrawlerResult
> {
  constructor(crawlerOptions: Partial<BasicCrawlerOptions>) {
    super(
      new BasicCrawler({
        ...crawlerOptions,
        retryOnBlocked: true,
        requestHandler: (...args) => this.requestHandler(...args),
        failedRequestHandler: (...args) => this.failedRequestHandler(...args),
      }),
    )
  }

  async requestHandler({ request, sendRequest }: BasicCrawlingContext) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- adapted from the official docs https://crawlee.dev/docs/guides/got-scraping#sendrequest-api
      const { body: file }: { body: Buffer } = await sendRequest({
        responseType: 'buffer',
      })
      this.success(request, { file })
    } catch (error) {
      this.failure(request, error as Error)
    }
  }

  failedRequestHandler({ request }: BasicCrawlingContext, error: Error) {
    this.failure(request, error)
  }
}
