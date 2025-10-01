import type {
  BasicCrawlerOptions,
  BasicCrawlingContext,
} from '../../../common/crawler'
import { FeatureCrawler, BasicCrawler } from '../../../common/crawler'
import type { UdemyCourseResponse } from './common'
import { getCourseSlug } from './common'

export interface UdemyAffiliateApiCrawlerResult {
  response: UdemyCourseResponse
}

export default class UdemyAffiliateApiCrawler extends FeatureCrawler<
  BasicCrawler,
  UdemyAffiliateApiCrawlerResult
> {
  constructor(crawlerOptions: BasicCrawlerOptions) {
    super(
      new BasicCrawler({
        ...crawlerOptions,
        retryOnBlocked: true,
        requestHandler: (...args) => this.requestHandler(...args),
        failedRequestHandler: (...args) => this.failedRequestHandler(...args),
      }),
    )
  }

  getDataRequestUrl(url: string) {
    const apiBaseUrl = 'https://www.udemy.com/api-2.0/courses'

    const courseSlug = getCourseSlug(url)

    if (!courseSlug) return null

    return `${apiBaseUrl}/${courseSlug}?fields[course]=title,visible_instructors,is_paid,created,description`
  }

  async requestHandler({ request, sendRequest }: BasicCrawlingContext) {
    try {
      const clientId = process.env.UDEMY_AFFILIATE_API_CLIENT_ID
      const clientSecret = process.env.UDEMY_AFFILIATE_API_CLIENT_SECRET

      if (!clientId) {
        request.noRetry = true
        throw new Error(`Udemy affialiate api client id was not found`)
      }

      if (!clientSecret) {
        request.noRetry = true
        throw new Error(`Udemy affiliate api client secret was not found`)
      }

      const dataRequestUrl = this.getDataRequestUrl(request.url)

      if (!dataRequestUrl) {
        request.noRetry = true
        throw new Error(
          `The resource url ${request.url} is not recognizable as a valid Udemy course url`,
        )
      }

      const Authentication = `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`,
      ).toString('base64')}`

      const { body } = (await sendRequest({
        url: dataRequestUrl,
        responseType: 'json',
        headers: {
          Authentication,
        },
      })) as { body: UdemyCourseResponse }

      this.success(request, {
        response: body,
      })
    } catch (error) {
      this.failure(request, error as Error)
    }
  }

  failedRequestHandler({ request }: BasicCrawlingContext, error: Error) {
    this.failure(request, error)
  }
}
