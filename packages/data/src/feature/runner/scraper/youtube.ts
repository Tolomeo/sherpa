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

interface FromYoutubeDataAPIV3ResponseOptions {
  url: string
  response: YoutubeDataApiV3Response
}

export const fromYoutubeDataAPIV3Response = ({
  response,
}: FromYoutubeDataAPIV3ResponseOptions) => {
  return {
    title: response.items[0].snippet.title,
  }
}
