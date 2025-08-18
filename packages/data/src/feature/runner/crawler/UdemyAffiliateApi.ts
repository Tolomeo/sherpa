/* eslint-disable @typescript-eslint/no-non-null-assertion -- several indirect accesses force to null-assert */
import type { BasicCrawlerOptions, BasicCrawlingContext } from './common'
import { FeatureCrawler, BasicCrawler } from './common'

// NB: this type contains only what we are checking for in the response
// the actual response is richer, see https://www.udemy.com/developers/affiliate/models/course/
// the available fields are defined by the 'fields' query parameter of the api request url
interface UdemyAffiliateApiResponse {
  title: string
}

export interface UdemyAffiliateApiCrawlerResult {
  response: UdemyAffiliateApiResponse
}

export default class UdemyAffiliateApiCrawler extends FeatureCrawler<
  BasicCrawler,
  UdemyAffiliateApiCrawlerResult
> {
  static getCourseSlug = (url: string) => {
    const courseUrl = /^https?:\/\/www\.udemy\.com\/course\/(\S+)$/

    if (courseUrl.test(url)) {
      const [, courseSlug] = url.match(courseUrl)!
      return courseSlug
    }

    return null
  }

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
    const { getCourseSlug } = UdemyAffiliateApiCrawler

    const courseSlug = getCourseSlug(url)

    if (courseSlug) return `${apiBaseUrl}/${courseSlug}?fields[course]=title`

    return null
  }

  async requestHandler({ request, sendRequest }: BasicCrawlingContext) {
    try {
      const {
        UDEMY_AFFILIATE_API_CLIENT_ID: clientId,
        UDEMY_AFFILIATE_API_CLIENT_SECRET: clientSecret,
      } = import.meta.env

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
      })) as { body: UdemyAffiliateApiResponse }

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
