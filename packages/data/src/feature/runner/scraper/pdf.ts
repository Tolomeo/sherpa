import {
  mapNullable,
  coalesce,
  toNullableArray,
} from '../../../common/nullable'
import { getPdfDocumentMetadata } from '../common/pdf'
import type { PDFMetadata } from '../../schema'

const metadataToString = (
  value: string | string[] | Record<string, string>,
  {
    ifArray = (v) => v[0],
    ifObject = (v) => Object.values(v)[0],
  }: {
    ifArray?: (v: string[]) => string
    ifObject?: (v: Record<string, string>) => string
  } = {},
) => {
  if (typeof value === 'string') return value

  if (Array.isArray(value)) return ifArray(value)

  return ifObject(value)
}

const metadataToArray = (
  value: string | string[] | Record<string, string>,
  {
    ifString = (v) => [v],
    ifObject = (v) => [Object.values(v)[0]],
  }: {
    ifString?: (v: string) => string[]
    ifObject?: (v: Record<string, string>) => Array<string>
  } = {},
) => {
  if (Array.isArray(value)) return value

  if (typeof value === 'string') return ifString(value)

  return ifObject(value)
}

export interface GetPdfMetadataOptions {
  url: string
  source: Buffer
}

export const getPdfMetadata = async ({
  url,
  source,
}: GetPdfMetadataOptions): Promise<PDFMetadata> => {
  const { info, metadata } = await getPdfDocumentMetadata(source)

  const title = coalesce(toNullableArray(metadata?.get('dc:title'), info.Title))

  const author = coalesce(
    toNullableArray(info.Author, metadata?.get('dc:creator')),
  )

  const publisher = coalesce(
    toNullableArray(
      metadata?.get('dc:publisher'),
      metadata?.get('prism2:issuingOrganization'),
      metadata?.get('prism:publisher'),
      metadata?.get('prism:publicationName'),
      metadata?.get('xmpRights:Owner'),
      metadata?.get('prism2:distributor'),
    ),
  )

  const publishedDate = coalesce(
    toNullableArray(
      metadata?.get('prism:publicationDate'),
      metadata?.get('dc:date'),
      metadata?.get('prism:availableDate'),
      metadata?.get('prism:coverDate'),
      metadata?.get('xmp:CreateDate'),
      metadata?.get('pdf:CreationDate'),
      info.CreationDate,
    ),
  )

  const modifiedDate = coalesce(
    toNullableArray(
      metadata?.get('xmp:ModifyDate'),
      metadata?.get('xmp:MetadataDate'),
      metadata?.get('pdf:ModDate'),
      metadata?.get('dc:date'),
      metadata?.get('prism:modificationDate'),
      info.ModDate,
    ),
  )

  return {
    title: mapNullable(title, metadataToString) || url.split('/').pop()!,
    author: mapNullable(author, metadataToString),
    publisher: mapNullable(publisher, metadataToArray),
    publishedDate: mapNullable(publishedDate, metadataToString),
    modifiedDate: mapNullable(modifiedDate, (m) =>
      metadataToString(m, { ifArray: (v) => v[v.length - 1] }),
    ),
  }
}
