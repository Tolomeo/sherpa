import { CheerioCrawler } from 'crawlee'
import type { CheerioCrawlerOptions, CheerioCrawlingContext } from 'crawlee'
import { decode, encode } from 'he'
import formatHTML from 'html-format'
import HealthCheckRunner from './Runner'

const filterEntities = function decodeEntities(html: string) {
  const entities: Record<string, string> = {
    '&#xAD;': '',
  }
  const eEntities = new RegExp(Object.keys(entities).join('|'), 'g')

  return decode(encode(html).replace(eEntities, (entity) => entities[entity]))
}

export interface HttpHealthCheckRequestData {
  titleSelector: string
}

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

  requestHandler({
    request,
    $,
  }: CheerioCrawlingContext<HttpHealthCheckRequestData>) {
    const {
      userData: { titleSelector },
    } = request

    const title = filterEntities($(titleSelector).text())

    if (title.trim() === '') {
      const pageContent = $.html()

      this.failure(
        request,
        new Error(
          `Could not retrieve title text from ${formatHTML(pageContent)}`,
        ),
      )

      return
    }

    this.success(request, { title })
  }

  failedRequestHandler(
    { request }: CheerioCrawlingContext<HttpHealthCheckRequestData>,
    error: Error,
  ) {
    this.failure(request, error)
  }
}
