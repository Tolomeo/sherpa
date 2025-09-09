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
      }
    }
    case 'channel': {
      const [item] = source.info.channel.items

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- the returned items list could be empty
      if (!item)
        throw new Error(`YouTube resource response for ${url} has no items`)

      return {
        title: item.snippet.title,
        author: `${getChannelHandle(url)}`,
        publisher: 'youtube.com',
        publishedDate: item.snippet.publishedAt,
      }
    }
  }
}
