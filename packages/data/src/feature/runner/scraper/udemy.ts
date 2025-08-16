interface UdemyAffiliateApiResponse {
  title: string
}

interface GetUdemyMetadataOptions {
  url: string
  source: UdemyAffiliateApiResponse
}

export interface UdemyMetadata {
  title: string
}

export const getUdemyMetadata = ({
  source,
}: GetUdemyMetadataOptions): UdemyMetadata => {
  return { title: source.title }
}
