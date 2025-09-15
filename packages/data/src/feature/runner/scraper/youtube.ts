import type { YoutubeDataAPIV3Metadata } from '../../schema'
import type { YouTubeDataApiV3CrawlerResponse } from '../crawler/YoutubeDataApi'
import { getChannelHandle } from '../common/youtube'

interface GetYoutubeDataAPIV3MetadataOptions {
  url: string
  source: YouTubeDataApiV3CrawlerResponse
}

export const getYoutubeDataAPIV3Metadata = ({
  url,
  source,
}: GetYoutubeDataAPIV3MetadataOptions): YoutubeDataAPIV3Metadata => {
  switch (source.kind) {
    case 'video': {
      const video = source.info.video
      const title = video.snippet.title
      const author = video.snippet.channelTitle
      const publisher = 'youtube.com'
      const publishedDate = video.snippet.publishedAt
      // NB: there seem to be no reliable way to get the time of last update of a video
      // TODO: modifiedDate from last comment on the video?
      const modifiedDate = video.snippet.publishedAt
      const description = video.snippet.description

      return {
        title,
        author,
        publisher,
        publishedDate,
        modifiedDate,
        description,
      }
    }
    case 'playlist': {
      const playlist = source.info.playlist
      const title = playlist.snippet.title
      const author = playlist.snippet.channelTitle
      const publisher = 'youtube.com'
      const publishedDate = playlist.snippet.publishedAt
      const [lastItem] = source.info.playlistItems
      const modifiedDate = lastItem.snippet.publishedAt
      const description = source.info.playlist.snippet.description

      return {
        title,
        author,
        publisher,
        publishedDate,
        modifiedDate,
        description,
      }
    }
    case 'channel': {
      const channel = source.info.channel
      const title = channel.snippet.title
      // TODO: author from channel.snipper.customUrl -- the property is not documented in types, so it should be checked whether it is stable
      const author = `${getChannelHandle(url)}`
      const publisher = 'youtube.com'
      const publishedDate = channel.snippet.publishedAt
      const [lastActivity] = source.info.channelActivities
      const modifiedDate = lastActivity.snippet.publishedAt
      const description = source.info.channel.snippet.description

      return {
        title,
        author,
        publisher,
        publishedDate,
        modifiedDate,
        description,
      }
    }
  }
}
