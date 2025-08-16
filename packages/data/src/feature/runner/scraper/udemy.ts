interface UdemyAffiliateApiResponse {
  title: string
}

interface FromUdemyAffiliateApiResponseOptions {
  url: string
  response: UdemyAffiliateApiResponse
}

export interface UdemyMetadata {
  title: string
}

export const getUdemyMetadata = ({
  response,
}: FromUdemyAffiliateApiResponseOptions): UdemyMetadata => {
  return { title: response.title }
}
