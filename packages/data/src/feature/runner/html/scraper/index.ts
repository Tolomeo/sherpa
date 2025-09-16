import createMetascraper from 'metascraper'
import { toNullableObject } from '../../../../common/nullable'
import type { HtmlMetadata } from '../../../schema'
import type { HtmlDOM } from '../common'
import { getHtmlDom } from '../common'
import createMetascraperTitleRules from './title'
import createMetascraperAuthorRules from './author'
import createPublisherAuthorRules from './publisher'
import createDateRules from './date'
import createDescriptionRules from './description'

const metascraper = createMetascraper([
  createMetascraperTitleRules(),
  createMetascraperAuthorRules(),
  createPublisherAuthorRules(),
  createDateRules(),
  createDescriptionRules(),
])

interface GetHtmlMetadataOptions {
  url: string
  source: HtmlDOM | string
}

export const getHtmlMetadata = async ({
  url,
  source,
}: GetHtmlMetadataOptions) => {
  const htmlDom = typeof source === 'string' ? getHtmlDom(source) : source
  const {
    // title
    documentTitle,
    displayTitle,
    openGraphTitle,
    twitterTitle,
    jsonldTitle,
    // author
    documentAuthor,
    openGraphAuthor,
    microdataAuthor,
    jsonldAuthor,
    displayAuthor,
    // publisher
    jsonldPublisher,
    documentPublisher,
    openGraphPublisher,
    twitterPublisher,
    displayPublisher,
    domainPublisher,
    // date
    documentDate,
    displayDate,
    // published date
    jsonldDatePublished,
    openGraphDatePublished,
    microdataDatePublished,
    displayDatePublished,
    // modified date
    jsonldDateModified,
    openGraphDateModified,
    microdataDateModified,
    // description
    openGraphDescription,
    twitterDescription,
    documentDescription,
    microdataDescription,
    jsonldDescription,
    // TODO: infer returned keys from rules
  } = await metascraper({
    url,
    htmlDom,
  })

  const htmlMetadata: HtmlMetadata = {
    title: toNullableObject({
      document: documentTitle,
      display: displayTitle,
      openGraph: openGraphTitle,
      twitter: twitterTitle,
      jsonld: jsonldTitle,
    }),
    author: toNullableObject({
      document: documentAuthor,
      display: displayAuthor,
      openGraph: openGraphAuthor,
      microdata: microdataAuthor,
      jsonld: jsonldAuthor,
    }),
    publisher: toNullableObject({
      jsonld: jsonldPublisher,
      document: documentPublisher,
      openGraph: openGraphPublisher,
      twitter: twitterPublisher,
      display: displayPublisher,
      domain: domainPublisher,
    }),
    date: toNullableObject({
      document: documentDate,
      display: displayDate,
    }),
    publishedDate: toNullableObject({
      jsonld: jsonldDatePublished,
      openGraph: openGraphDatePublished,
      microdata: microdataDatePublished,
      display: displayDatePublished,
    }),
    modifiedDate: toNullableObject({
      jsonld: jsonldDateModified,
      openGraph: openGraphDateModified,
      microdata: microdataDateModified,
    }),
    description: toNullableObject({
      openGraph: openGraphDescription,
      twitter: twitterDescription,
      document: documentDescription,
      microdata: microdataDescription,
      jsonld: jsonldDescription,
    }),
  }

  return htmlMetadata
}
