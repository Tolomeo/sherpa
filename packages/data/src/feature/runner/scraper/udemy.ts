import type { UdemyAffiliateAPIMetadata } from '../../schema'
import type { UdemyCourseResponse } from '../common/udemy'

interface GetUdemyMetadataOptions {
  url: string
  source: UdemyCourseResponse
}

export const getUdemyMetadata = ({
  source,
}: GetUdemyMetadataOptions): UdemyAffiliateAPIMetadata => {
  return {
    title: source.title,
    author: source.visible_instructors.map((instructor) => instructor.title),
    publisher: 'udemy.com',
  }
}
