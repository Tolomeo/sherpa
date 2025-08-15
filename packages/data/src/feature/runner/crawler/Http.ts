import { CheerioAPI } from 'cheerio'
import type { HttpHealthcheckRunConfig } from '../../../../types'
import type { CheerioCrawlerOptions, CheerioCrawlingContext } from './common'
import { FeatureCrawler, CheerioCrawler } from './common'

export interface HttpCrawlerResult {
  htmlDom: CheerioAPI
}

export default class HttpCrawler extends FeatureCrawler<
  CheerioCrawler,
  HttpCrawlerResult
> {
  constructor(crawlerOptions: Partial<CheerioCrawlerOptions>) {
    super(
      new CheerioCrawler({
        ...crawlerOptions,
        keepAlive: true,
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
    this.success(request, { htmlDom: $ })
    /* const metadata = await this.getMetadata({ url: request.url, htmlDom: $ })

    let { title, documentTitle, metadataTitle, displayTitle } = metadata

    if (!title && !documentTitle && !metadataTitle && !displayTitle) {
      this.failure(request, new Error(`Could not retrieve title text`))

      return
    }

    title = title && this.filterEntities(title)
    documentTitle = documentTitle && this.filterEntities(documentTitle)
    metadataTitle = metadataTitle && this.filterEntities(metadataTitle)
    displayTitle = displayTitle && this.filterEntities(displayTitle)

    this.success(request, { title, documentTitle, metadataTitle, displayTitle }) */
  }

  failedRequestHandler(
    { request }: CheerioCrawlingContext<HttpHealthcheckRunConfig>,
    error: Error,
  ) {
    this.failure(request, error)
  }
}
