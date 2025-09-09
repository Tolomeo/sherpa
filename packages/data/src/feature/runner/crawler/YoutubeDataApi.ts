import type {
  YouTubeVideoResponse,
  YouTubePlaylistResponse,
  YouTubeChannelResponse,
} from '../common/youtube'
import { getVideoId, getPlaylistId, getChannelHandle } from '../common/youtube'
import { FeatureCrawler, BasicCrawler } from './common'
import type { BasicCrawlerOptions, BasicCrawlingContext } from './common'

interface YoutubeDataApiV3CrawlerVideoResponse {
  kind: 'video'
  info: {
    video: YouTubeVideoResponse
  }
}

interface YoutubeDataApiV3CrawlerPlaylistResponse {
  kind: 'playlist'
  info: {
    playlist: YouTubePlaylistResponse
  }
}

interface YoutubeDataApiV3CrawlerChannelResponse {
  kind: 'channel'
  info: {
    channel: YouTubeChannelResponse
  }
}

export type YouTubeDataApiV3CrawlerResponse =
  | YoutubeDataApiV3CrawlerVideoResponse
  | YoutubeDataApiV3CrawlerPlaylistResponse
  | YoutubeDataApiV3CrawlerChannelResponse

export interface YoutubeDataApiV3CrawlerResult {
  response: YouTubeDataApiV3CrawlerResponse
}

export default class YoutubeDataApiV3Crawler extends FeatureCrawler<
  BasicCrawler,
  YoutubeDataApiV3CrawlerResult
> {
  static apiBaseUrl = 'https://youtube.googleapis.com/youtube/v3'

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

  async getVideoInfo(
    { videoId, apiKey }: { videoId: string; apiKey: string },
    { sendRequest }: BasicCrawlingContext,
  ) {
    const apiBaseUrl = YoutubeDataApiV3Crawler.apiBaseUrl

    const { body: video } = (await sendRequest({
      url: `${apiBaseUrl}/videos?id=${videoId}&key=${apiKey}&part=snippet&maxResults=1`,
      responseType: 'json',
    })) as { body: YouTubeVideoResponse }

    return { video }
  }

  async getPlaylistInfo(
    { playlistId, apiKey }: { playlistId: string; apiKey: string },
    { sendRequest }: BasicCrawlingContext,
  ) {
    const apiBaseUrl = YoutubeDataApiV3Crawler.apiBaseUrl

    const { body: playlist } = (await sendRequest({
      url: `${apiBaseUrl}/playlists?id=${playlistId}&key=${apiKey}&part=snippet&maxResults=1`,
      responseType: 'json',
    })) as { body: YouTubePlaylistResponse }

    return { playlist }
  }

  async getChannelInfo(
    { channelHandle, apiKey }: { channelHandle: string; apiKey: string },
    { sendRequest }: BasicCrawlingContext,
  ) {
    const apiBaseUrl = YoutubeDataApiV3Crawler.apiBaseUrl

    const { body: channel } = (await sendRequest({
      url: `${apiBaseUrl}/channels?forHandle=${channelHandle}&key=${apiKey}&part=snippet&maxResults=1`,
      responseType: 'json',
    })) as { body: YouTubeChannelResponse }

    return { channel }
  }

  async requestHandler(context: BasicCrawlingContext) {
    try {
      const apiKey = process.env.YOUTUBE_API_KEY

      if (!apiKey) {
        context.request.noRetry = true
        throw new Error(`Youtube data api key not found`)
      }

      const videoId = getVideoId(context.request.url)
      if (videoId) {
        const info = await this.getVideoInfo(
          { videoId, apiKey },
          context,
        )

        return this.success(context.request, {
          response: {
            kind: 'video',
            info,
          },
        })
      }

      const playlistId = getPlaylistId(context.request.url)
      if (playlistId) {
        const info = await this.getPlaylistInfo(
          { playlistId, apiKey },
          context,
        )

        return this.success(context.request, {
          response: {
            kind: 'playlist',
            info,
          },
        })
      }

      const channelHandle = getChannelHandle(context.request.url)
      if (channelHandle) {
        const info = await this.getChannelInfo(
          { channelHandle, apiKey },
          context,
        )

        return this.success(context.request, {
          response: {
            kind: 'channel',
            info,
          },
        })
      }

      throw new Error(
        `The url "${context.request.url}" is not recognizable as a valid video, playlist or channel youtube url`,
      )
    } catch (error) {
      this.failure(context.request, error as Error)
    }
  }

  failedRequestHandler({ request }: BasicCrawlingContext, error: Error) {
    this.failure(request, error)
  }
}
