/* eslint-disable @typescript-eslint/no-non-null-assertion -- several indirect accesses force to null-assert */
import { HealthCheckRunner, BasicCrawler } from './common'
import type { BasicCrawlerOptions, BasicCrawlingContext } from './common'

// NB: this type contains only what we are checking for in the response, when we pass 'snippet' as value for 'part' query parameter
// the actual response is richer
interface YoutubeDataApiResponse {
  items: {
    snippet: {
      title: string
    }
  }[]
  pageInfo: {
    totalResults: number
  }
}

export default class YoutubeDataApiV3HealthCheckRunner extends HealthCheckRunner<BasicCrawler> {
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
    super()
    this.crawler = new BasicCrawler({
      ...crawlerOptions,
      keepAlive: true,
      retryOnBlocked: true,
      requestHandler: this.requestHandler.bind(this),
      failedRequestHandler: this.failedRequestHandler.bind(this),
    })
  }

  getDataRequestUrl(url: string, apiKey: string) {
    const apiBaseUrl = 'https://youtube.googleapis.com/youtube/v3'

    const { getVideoId, getPlaylistId, getChannelId } =
      YoutubeDataApiV3HealthCheckRunner

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
    const { YOUTUBE_API_KEY: apiKey } = import.meta.env

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
    })) as { body: YoutubeDataApiResponse }

    if (body.pageInfo.totalResults < 1) {
      this.failure(
        request,
        new Error(`Api response returned no results: ${JSON.stringify(body)}`),
      )
      request.noRetry = true
      return
    }

    this.success(request, {
      title: body.items[0].snippet.title,
    })
  }

  failedRequestHandler({ request }: BasicCrawlingContext, error: Error) {
    this.failure(request, error)
  }
}
