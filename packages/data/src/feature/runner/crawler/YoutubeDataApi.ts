/* eslint-disable @typescript-eslint/no-non-null-assertion -- several indirect accesses force to null-assert */
import { FeatureCrawler, BasicCrawler } from './common'
import type { BasicCrawlerOptions, BasicCrawlingContext } from './common'

// NB: this type contains only what we are checking for in the response, when we pass 'snippet' as value for 'part' query parameter
// the actual response is richer
interface YoutubeDataApiV3Response {
  items: {
    snippet: {
      title: string
    }
  }[]
  pageInfo: {
    totalResults: number
  }
}

export interface YoutubeDataApiV3CrawlerResult {
  response: YoutubeDataApiV3Response
}

export default class YoutubeDataApiV3Crawler extends FeatureCrawler<
  BasicCrawler,
  YoutubeDataApiV3CrawlerResult
> {
  static getVideoId = (url: string) => {
    const videoUrl = /^https?:\/\/www\.youtube\.com\/watch\?v=(\S+)$/

    if (videoUrl.test(url)) {
      const [, videoId] = url.match(videoUrl)!
      return videoId
    }

    return null
  }

  static getPlaylistId = (url: string) => {
    const playlistUrl = /^https?:\/\/www\.youtube\.com\/playlist\?list=(\S+)$/

    if (playlistUrl.test(url)) {
      const [, playlistId] = url.match(playlistUrl)!
      return playlistId
    }

    return null
  }

  static getChannelId = (url: string) => {
    const channelUrl = /^https?:\/\/www.youtube.com\/(?:@|c\/){1}(\S+)$/

    if (channelUrl.test(url)) {
      const [, channelHandle] = url.match(channelUrl)!
      return channelHandle
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

  getDataRequestUrl(url: string, apiKey: string) {
    const apiBaseUrl = 'https://youtube.googleapis.com/youtube/v3'

    const { getVideoId, getPlaylistId, getChannelId } = YoutubeDataApiV3Crawler

    const videoId = getVideoId(url)
    if (videoId)
      return `${apiBaseUrl}/videos?id=${videoId}&key=${apiKey}&part=snippet&maxResults=1`

    const playlistId = getPlaylistId(url)
    if (playlistId)
      return `${apiBaseUrl}/playlists?id=${playlistId}&key=${apiKey}&part=snippet&maxResults=1`

    // NB: youtube data api doesn't yet support retrieving channel's data by handle
    // therefore we are executing a channel search specifying the channel handle as query
    // see https://stackoverflow.com/a/74902789/3162406
    const channelId = getChannelId(url)
    if (channelId)
      return `${apiBaseUrl}/search?q=%40${channelId}&type=channel&key=${apiKey}&part=snippet&maxResults=1`

    return null
  }

  async requestHandler({ request, sendRequest }: BasicCrawlingContext) {
    const apiKey = process.env.YOUTUBE_API_KEY

    if (!apiKey) {
      this.failure(request, new Error(`Youtube data api key not found`))
      request.noRetry = true
      return
    }

    const dataRequestUrl = this.getDataRequestUrl(request.url, apiKey)

    if (!dataRequestUrl) {
      this.failure(
        request,
        new Error(
          `The url "${request.url}" is not recognizable as a valid video, playlist or channel youtube url`,
        ),
      )
      request.noRetry = true
      return
    }

    const { body } = (await sendRequest({
      url: dataRequestUrl,
      responseType: 'json',
    })) as { body: YoutubeDataApiV3Response }

    if (body.pageInfo.totalResults < 1) {
      this.failure(
        request,
        new Error(`Api response returned no results: ${JSON.stringify(body)}`),
      )
      request.noRetry = true
      return
    }

    this.success(request, {
      response: body,
    })
  }

  failedRequestHandler({ request }: BasicCrawlingContext, error: Error) {
    this.failure(request, error)
  }
}
