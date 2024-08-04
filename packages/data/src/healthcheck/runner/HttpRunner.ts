import { CheerioCrawler } from 'crawlee'
import type { CheerioCrawlerOptions, CheerioCrawlingContext } from 'crawlee'
import type { HttpHealthcheckRunConfig } from '../../../types'
import { HealthCheckRunner } from './common'

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
    const {
      userData: { titleSelector },
    } = request

    const metadata = await this.getMetadata({ url: request.url, htmlDom: $ })

    const { title } = metadata

    if (!title || title.trim() === '') {
      this.failure(request, new Error(`Could not retrieve title text`))

      return
    }

    this.success(request, { title: this.filterEntities(title) })
  }

  failedRequestHandler(
    { request }: CheerioCrawlingContext<HttpHealthcheckRunConfig>,
    error: Error,
  ) {
    this.failure(request, error)
  }
}
