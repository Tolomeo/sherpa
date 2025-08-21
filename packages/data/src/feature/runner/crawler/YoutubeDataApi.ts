/* eslint-disable @typescript-eslint/no-non-null-assertion -- several indirect accesses force to null-assert */
import type { YoutubeResourceResponse } from '../common/youtubeApi'
import { FeatureCrawler, BasicCrawler } from './common'
import type { BasicCrawlerOptions, BasicCrawlingContext } from './common'

export interface YoutubeDataApiV3CrawlerResult {
  response: YoutubeResourceResponse
}

export default class YoutubeDataApiV3Crawler extends FeatureCrawler<
  BasicCrawler,
  YoutubeDataApiV3CrawlerResult
> {
  static getVideoId = (url: string) => {
    const videoUrl = /^https?:\/\/www\.youtube\.com\/watch\?v=(\S+)$/

    const match = videoUrl.exec(url)

    if (!match) return null

    const [, videoId] = match
    return videoId
  }

  static getPlaylistId = (url: string) => {
    const playlistUrl = /^https?:\/\/www\.youtube\.com\/playlist\?list=(\S+)$/

    const match = playlistUrl.exec(url)

    if (!match) return null

    const [, playlistId] = match
    return playlistId
  }

  static getChannelId = (url: string) => {
    const channelUrl = /^https?:\/\/www.youtube.com\/(?:@|c\/){1}(\S+)$/

    const match = channelUrl.exec(url)

    if (!match) return null

    const [, channelHandle] = match
    return channelHandle
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
    try {
      const apiKey = process.env.YOUTUBE_API_KEY

      if (!apiKey) {
        request.noRetry = true
        throw new Error(`Youtube data api key not found`)
      }

      const dataRequestUrl = this.getDataRequestUrl(request.url, apiKey)

      if (!dataRequestUrl) {
        request.noRetry = true
        throw new Error(
          `The url "${request.url}" is not recognizable as a valid video, playlist or channel youtube url`,
        )
      }

      const { body } = (await sendRequest({
        url: dataRequestUrl,
        responseType: 'json',
      })) as { body: YoutubeResourceResponse }

      if (body.pageInfo.totalResults < 1) {
        request.noRetry = true
        throw new Error(
          `Api response returned no results: ${JSON.stringify(body)}`,
        )
      }

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
