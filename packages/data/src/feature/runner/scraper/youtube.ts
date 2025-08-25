import type { YoutubeDataAPIV3Metadata } from '../../schema'
import type { YoutubeResourceResponse } from '../common/youtube'
import { getChannelHandle } from '../common/youtube'

interface GetYoutubeDataAPIV3MetadataOptions {
  url: string
  source: YoutubeResourceResponse
}

export const getYoutubeDataAPIV3Metadata = ({
  url,
  source,
}: GetYoutubeDataAPIV3MetadataOptions): YoutubeDataAPIV3Metadata => {
  const [item] = source.items

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- the returned items list could be empty
  if (!item)
    throw new Error(`YouTube resource response for ${url} has no items`)

  switch (item.kind) {
    case 'youtube#video':
    case 'youtube#playlist':
      return {
        title: item.snippet.title,
        author: item.snippet.channelTitle,
      }
    case 'youtube#channel':
      return {
        title: item.snippet.title,
        author: `youtube.com/${getChannelHandle(url)}`,
      }
    default:
      // @ts-expect-error -- this is to ensure we throw an error for any changes in the apis
      throw new Error(`YouTube resource kind ${item.kind} not recognized`)
  }
}
