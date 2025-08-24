import type { YoutubeResourceResponse } from '../common/youtubeApi'
import {
  getVideoId,
  getPlaylistId,
  getChannelHandle,
} from '../common/youtubeApi'
import { FeatureCrawler, BasicCrawler } from './common'
import type { BasicCrawlerOptions, BasicCrawlingContext } from './common'

export interface YoutubeDataApiV3CrawlerResult {
  response: YoutubeResourceResponse
}

export default class YoutubeDataApiV3Crawler extends FeatureCrawler<
  BasicCrawler,
  YoutubeDataApiV3CrawlerResult
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

  getDataRequestUrl(url: string, apiKey: string) {
    const apiBaseUrl = 'https://youtube.googleapis.com/youtube/v3'

    const videoId = getVideoId(url)
    if (videoId)
      return `${apiBaseUrl}/videos?id=${videoId}&key=${apiKey}&part=snippet&maxResults=1`

    const playlistId = getPlaylistId(url)
    if (playlistId)
      return `${apiBaseUrl}/playlists?id=${playlistId}&key=${apiKey}&part=snippet&maxResults=1`

    const channelHandle = getChannelHandle(url)
    if (channelHandle)
      return `${apiBaseUrl}/channels?forHandle=${channelHandle}&key=${apiKey}&part=snippet&maxResults=1`

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
