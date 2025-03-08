import type { HttpHealthcheckRunConfig } from '../../../types'
import { HealthCheckRunner, CheerioCrawler } from './common'
import type { CheerioCrawlerOptions, CheerioCrawlingContext } from './common'

export default class HttpHealthCheckRunner extends HealthCheckRunner<CheerioCrawler> {
  constructor(crawlerOptions: Partial<CheerioCrawlerOptions>) {
    super()

    this.crawler = new CheerioCrawler({
      ...crawlerOptions,
      keepAlive: true,
      retryOnBlocked: true,
      requestHandler: this.requestHandler.bind(this),
      failedRequestHandler: this.failedRequestHandler.bind(this),
    })
  }

  async requestHandler({
    request,
    $,
  }: CheerioCrawlingContext<HttpHealthcheckRunConfig>) {
    /* const {
      userData: { titleSelector },
    } = request */

    const metadata = await this.getMetadata({ url: request.url, htmlDom: $ })

    let { title, documentTitle, metadataTitle, displayTitle } = metadata

    if (!title && !documentTitle && !metadataTitle && !displayTitle) {
      this.failure(request, new Error(`Could not retrieve title text`))

      return
    }

    title = title && this.filterEntities(title)
    documentTitle = documentTitle && this.filterEntities(documentTitle)
    metadataTitle = metadataTitle && this.filterEntities(metadataTitle)
    displayTitle = displayTitle && this.filterEntities(displayTitle)

    this.success(request, { title, documentTitle, metadataTitle, displayTitle })
  }

  failedRequestHandler(
    { request }: CheerioCrawlingContext<HttpHealthcheckRunConfig>,
    error: Error,
  ) {
    this.failure(request, error)
  }
}
