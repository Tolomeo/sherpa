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
      const [item] = source.info.video.items

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- the returned items list could be empty
      if (!item)
        throw new Error(`YouTube resource response for ${url} has no items`)

      return {
        title: item.snippet.title,
        author: item.snippet.channelTitle,
        publisher: 'youtube.com',
        publishedDate: item.snippet.publishedAt,
        // TODO: modifiedDate from last comment on the video?
        modifiedDate: item.snippet.publishedAt,
      }
    }
    case 'playlist': {
      const [item] = source.info.playlist.items

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- the returned items list could be empty
      if (!item)
        throw new Error(`YouTube resource response for ${url} has no items`)

      return {
        title: item.snippet.title,
        author: item.snippet.channelTitle,
        publisher: 'youtube.com',
        publishedDate: item.snippet.publishedAt,
        modifiedDate: item.snippet.publishedAt,
      }
    }
    case 'channel': {
      const channel = source.info.channel
      const title = channel.snippet.title
      // TODO: author from channel.snipper.customUrl -- the property is not documented in types, so it should be checked whether it is stable
      const author = `${getChannelHandle(url)}`
      const publisher = 'youtube.com'
      const publishedDate = channel.snippet.publishedAt
      const [lastActivity] = source.info.channelActivity

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- the returned items list could be empty
      if (!lastActivity) {
        throw new Error(
          `No channel activities found for YouTube channel ${url}`,
        )
      }

      const modifiedDate = lastActivity.snippet.publishedAt

      return {
        title,
        author,
        publisher,
        publishedDate,
        modifiedDate,
      }
    }
  }
}
