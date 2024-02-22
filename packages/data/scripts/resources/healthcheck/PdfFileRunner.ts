/* eslint-disable @typescript-eslint/no-non-null-assertion -- several indirect accesses force to null-assert */
import { BasicCrawler } from 'crawlee'
import type { BasicCrawlerOptions, BasicCrawlingContext } from 'crawlee'
import { fileTypeFromBuffer } from 'file-type'
import HealthCheckRunner from './Runner'

export default class PdfFileHealthCheckRunner extends HealthCheckRunner<BasicCrawler> {
  constructor(crawlerOptions: Partial<BasicCrawlerOptions>) {
    super()
    this.crawler = new BasicCrawler({
      ...crawlerOptions,
      keepAlive: true,
      retryOnBlocked: true,
      requestHandler: this.requestHandler.bind(this),
      failedRequestHandler: this.failedRequestHandler.bind(this),
    })
  }

  async requestHandler({ request, sendRequest }: BasicCrawlingContext) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- adapted from the official docs https://crawlee.dev/docs/guides/got-scraping#sendrequest-api
    const { body } = await sendRequest({
      responseType: 'buffer',
    })
    const file = await fileTypeFromBuffer(body as Buffer)

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
