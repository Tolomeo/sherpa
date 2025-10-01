// TODO: remove references to healthcheck types
import type { HttpHealthcheckRunConfig } from '../../../../../types'
import type {
  CheerioCrawlerOptions,
  CheerioCrawlingContext,
} from '../../../../common/crawler'
import { FeatureCrawler, CheerioCrawler } from '../../../../common/crawler'
import type { HtmlDOM } from '../common'

export interface HttpCrawlerResult {
  dom: HtmlDOM
}

export default class HttpCrawler extends FeatureCrawler<
  CheerioCrawler,
  HttpCrawlerResult
> {
  constructor(crawlerOptions: Partial<CheerioCrawlerOptions>) {
    super(
      new CheerioCrawler({
        ...crawlerOptions,
        retryOnBlocked: true,
        requestHandler: (...args) => this.requestHandler(...args),
        failedRequestHandler: (...args) => this.failedRequestHandler(...args),
      }),
    )
  }

  requestHandler({
    request,
    $,
  }: CheerioCrawlingContext<HttpHealthcheckRunConfig>) {
    this.success(request, { dom: $ })
  }

  failedRequestHandler(
    { request }: CheerioCrawlingContext<HttpHealthcheckRunConfig>,
    error: Error,
  ) {
    this.failure(request, error)
  }
}
