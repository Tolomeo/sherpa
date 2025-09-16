import type {
  BasicCrawlerOptions,
  BasicCrawlingContext,
} from '../../../common/crawler'
import { FeatureCrawler, BasicCrawler } from '../../../common/crawler'
import { getVideoId, getPlaylistId, getChannelHandle } from './common'
import type {
  YouTubeVideoResponse,
  YouTubePlaylistResponse,
  YouTubeChannelResponse,
  YouTubeActivitiesResponse,
  YouTubeActivity,
  YouTubeChannel,
  YouTubeVideo,
  YouTubePlaylist,
  YouTubePlaylistItem,
  YouTubePlaylistItemsResponse,
} from './common'

interface YoutubeDataApiV3CrawlerVideoResponse {
  kind: 'video'
  info: {
    video: YouTubeVideo
  }
}

interface YoutubeDataApiV3CrawlerPlaylistResponse {
  kind: 'playlist'
  info: {
    playlist: YouTubePlaylist
    playlistItems: YouTubePlaylistItem[]
  }
}

interface YoutubeDataApiV3CrawlerChannelResponse {
  kind: 'channel'
  info: {
    channel: YouTubeChannel
    channelActivities: YouTubeActivity[]
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

    const { body: videoResponse } = (await sendRequest({
      url: `${apiBaseUrl}/videos?id=${videoId}&key=${apiKey}&part=snippet&maxResults=1`,
      responseType: 'json',
    })) as { body: YouTubeVideoResponse }

    const [video] = videoResponse.items

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- the returned items list could be empty
    if (!video) {
      throw new Error(
        `YouTube video response for video id ${videoId} has no items`,
      )
    }

    return { video }
  }

  async getPlaylistInfo(
    { playlistId, apiKey }: { playlistId: string; apiKey: string },
    { sendRequest }: BasicCrawlingContext,
  ) {
    const apiBaseUrl = YoutubeDataApiV3Crawler.apiBaseUrl

    const { body: playlistResponse } = (await sendRequest({
      url: `${apiBaseUrl}/playlists?id=${playlistId}&key=${apiKey}&part=snippet&maxResults=1`,
      responseType: 'json',
    })) as { body: YouTubePlaylistResponse }

    const [playlist] = playlistResponse.items

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- the returned items list could be empty
    if (!playlist) {
      throw new Error(
        `YouTube playlist response for playlist id ${playlistId} has no items`,
      )
    }

    const { body: playlistItemsResponse } = (await sendRequest({
      // NB: maxResults is set to 1 because we care about the last item only to infer the modification date of the playlist
      url: `${apiBaseUrl}/playlistItems?playlistId=${playlistId}&key=${apiKey}&part=snippet&maxResults=1`,
      responseType: 'json',
    })) as { body: YouTubePlaylistItemsResponse }

    const playlistItems = playlistItemsResponse.items

    if (!playlistItems.length) {
      throw new Error(
        `YouTube playlist items response for playlist id ${playlistId} has no items`,
      )
    }

    return { playlist, playlistItems }
  }

  async getChannelInfo(
    { channelHandle, apiKey }: { channelHandle: string; apiKey: string },
    { sendRequest }: BasicCrawlingContext,
  ) {
    const apiBaseUrl = YoutubeDataApiV3Crawler.apiBaseUrl

    const { body: channelResponse } = (await sendRequest({
      url: `${apiBaseUrl}/channels?forHandle=${channelHandle}&key=${apiKey}&part=snippet&maxResults=1`,
      responseType: 'json',
    })) as { body: YouTubeChannelResponse }

    const [channel] = channelResponse.items

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- the returned items list could be empty
    if (!channel) {
      throw new Error(
        `YouTube channel response for handle ${channelHandle} has no items`,
      )
    }

    const { body: activityResponse } = (await sendRequest({
      url: `${apiBaseUrl}/activities?channelId=${channel.id}&key=${apiKey}&part=snippet&maxResults=1`,
      responseType: 'json',
    })) as { body: YouTubeActivitiesResponse }

    const channelActivities = activityResponse.items

    if (!channelActivities.length) {
      throw new Error(
        `YouTube activities for channel handle ${channelHandle} returned no items`,
      )
    }

    return { channel, channelActivities }
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
        const info = await this.getVideoInfo({ videoId, apiKey }, context)

        return this.success(context.request, {
          response: {
            kind: 'video',
            info,
          },
        })
      }

      const playlistId = getPlaylistId(context.request.url)
      if (playlistId) {
        const info = await this.getPlaylistInfo({ playlistId, apiKey }, context)

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
