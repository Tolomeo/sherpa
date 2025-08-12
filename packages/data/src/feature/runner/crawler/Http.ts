import { FeatureCrawler, CheerioCrawler } from './common'
import type { CheerioCrawlerOptions } from './common'

export default class HttpFeatureCrawler extends FeatureCrawler<CheerioCrawler> {
  constructor(crawlerOptions: Partial<CheerioCrawlerOptions>) {
    super(
      new CheerioCrawler({
        ...crawlerOptions,
        keepAlive: true,
        retryOnBlocked: true,
        requestHandler: async ({ request, $ }) => {
          const metadata = await this.getMetadata({
            url: request.url,
            htmlDom: $,
          })

          let { title, documentTitle, metadataTitle, displayTitle } = metadata

          if (!title && !documentTitle && !metadataTitle && !displayTitle) {
            this.failure(request, new Error(`Could not retrieve title text`))

            return
          }

          title = title && this.filterEntities(title)
          documentTitle = documentTitle && this.filterEntities(documentTitle)
          metadataTitle = metadataTitle && this.filterEntities(metadataTitle)
          displayTitle = displayTitle && this.filterEntities(displayTitle)

          this.success(request, {
            title,
            documentTitle,
            metadataTitle,
            displayTitle,
          })
        },
        failedRequestHandler: ({ request }, error) => {
          this.failure(request, error)
        },
      }),
    )
  }
}
