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

interface FromYoutubeDataAPIV3ResponseOptions {
  url: string
  response: YoutubeDataApiV3Response
}

export const getYoutubeDataAPIV3Metadata = ({
  response,
}: FromYoutubeDataAPIV3ResponseOptions): YoutubeAPIV3Metadata => {
  return {
    title: response.items[0].snippet.title,
  }
}
