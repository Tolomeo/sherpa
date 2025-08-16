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

export interface YoutubeAPIV3Metadata {
  title: string
}

interface GetYoutubeDataAPIV3MetadataOptions {
  url: string
  source: YoutubeDataApiV3Response
}

export const getYoutubeDataAPIV3Metadata = ({
  source,
}: GetYoutubeDataAPIV3MetadataOptions): YoutubeAPIV3Metadata => {
  return {
    title: source.items[0].snippet.title,
  }
}
