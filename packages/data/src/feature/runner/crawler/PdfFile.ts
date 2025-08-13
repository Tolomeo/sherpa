import type { BasicCrawlerOptions, BasicCrawlingContext } from './common'
import { FeatureCrawler, BasicCrawler, fileTypeFromBuffer } from './common'

export default class PdfFileCrawler extends FeatureCrawler<BasicCrawler> {
  constructor(crawlerOptions: Partial<BasicCrawlerOptions>) {
    super(
      new BasicCrawler({
        ...crawlerOptions,
        keepAlive: true,
        retryOnBlocked: true,
        requestHandler: (...args) => this.requestHandler(...args),
        failedRequestHandler: (...args) => this.failedRequestHandler(...args),
      }),
    )
  }

  async requestHandler({ request, sendRequest }: BasicCrawlingContext) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- adapted from the official docs https://crawlee.dev/docs/guides/got-scraping#sendrequest-api
    const { body } = await sendRequest({
      responseType: 'buffer',
    })
    const file = await fileTypeFromBuffer(body as unknown as Buffer)

    if (!file || file.ext !== 'pdf' || file.mime !== 'application/pdf') {
      this.failure(
        request,
        new Error(
          `The received buffer is not a pdf. The buffer is instead a ${JSON.stringify(
            file,
          )} filetype`,
        ),
      )
      return
    }

    this.success(request, { title: request.url.split('/').pop()! })
  }

  failedRequestHandler({ request }: BasicCrawlingContext, error: Error) {
    this.failure(request, error)
  }
}
