interface UdemyAffiliateApiResponse {
  title: string
}

interface FromUdemyAffiliateApiResponseOptions {
  url: string
  response: UdemyAffiliateApiResponse
}

export const fromUdemyaffiliateApiResponse = ({
  response,
}: FromUdemyAffiliateApiResponseOptions) => {
  return { title: response.title }
}
