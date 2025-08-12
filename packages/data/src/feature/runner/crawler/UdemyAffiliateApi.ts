/* eslint-disable @typescript-eslint/no-non-null-assertion -- several indirect accesses force to null-assert */
import { HealthCheckRunner, BasicCrawler } from './common'
import type { BasicCrawlerOptions, BasicCrawlingContext } from './common'

// NB: this type contains only what we are checking for in the response
// the actual response is richer, see https://www.udemy.com/developers/affiliate/models/course/
// the available fields are defined by the 'fields' query parameter of the api request url
interface UdemyAffiliateApiResponse {
  title: string
}

export default class UdemyAffiliateApiHealthCheckRunner extends HealthCheckRunner<BasicCrawler> {
  static getCourseSlug = (url: string) => {
    const courseUrl = /^https?:\/\/www\.udemy\.com\/course\/(\S+)$/

    if (courseUrl.test(url)) {
      const [, courseSlug] = url.match(courseUrl)!
      return courseSlug
    }

    return null
  }

  constructor(crawlerOptions: BasicCrawlerOptions) {
    super()
    this.crawler = new BasicCrawler({
      ...crawlerOptions,
      keepAlive: true,
      retryOnBlocked: true,
      requestHandler: this.requestHandler.bind(this),
      failedRequestHandler: this.failedRequestHandler.bind(this),
    })
  }

  getDataRequestUrl(url: string) {
    const apiBaseUrl = 'https://www.udemy.com/api-2.0/courses'
    const { getCourseSlug } = UdemyAffiliateApiHealthCheckRunner

    const courseSlug = getCourseSlug(url)

    if (courseSlug) return `${apiBaseUrl}/${courseSlug}?fields[course]=title`

    return null
  }

  async requestHandler({ request, sendRequest }: BasicCrawlingContext) {
    const {
      UDEMY_AFFILIATE_API_CLIENT_ID: clientId,
      UDEMY_AFFILIATE_API_CLIENT_SECRET: clientSecret,
    } = import.meta.env

    if (!clientId) {
      this.failure(
        request,
        new Error(`Udemy affialiate api client id was not found`),
      )
      request.noRetry = true
      return
    }

    if (!clientSecret) {
      this.failure(
        request,
        new Error(`Udemy affiliate api client secret was not found`),
      )
      request.noRetry = true
      return
    }

    const dataRequestUrl = this.getDataRequestUrl(request.url)

    if (!dataRequestUrl) {
      this.failure(
        request,
        new Error(
          `The resource url ${request.url} is not recognizable as a valid Udemy course url`,
        ),
      )
      request.noRetry = true
      return
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
      title: body.title,
    })
  }

  failedRequestHandler({ request }: BasicCrawlingContext, error: Error) {
    this.failure(request, error)
  }
}
