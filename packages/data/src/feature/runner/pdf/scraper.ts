import type { PDFMetadata } from '../../schema'
import {
  mapNullable,
  coalesce,
  toNullableArray,
} from '../../../common/nullable'
import { getPdfDocumentMetadata } from './common'
import type { PdfFileCrawlerResult } from './crawler'

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
  source: PdfFileCrawlerResult
}

export const getPdfMetadata = async ({
  // url,
  source: { file, filename },
}: GetPdfMetadataOptions): Promise<PDFMetadata> => {
  const { info, metadata } = await getPdfDocumentMetadata(file)

  const title = coalesce(toNullableArray(metadata?.get('dc:title'), info.Title))

  const author = coalesce(
    toNullableArray(info.Author, metadata?.get('dc:creator')),
  )

  const publisher = coalesce(
    toNullableArray(
      metadata?.get('dc:publisher'),
      metadata?.get('prism2:issuingorganization'),
      metadata?.get('prism:publisher'),
      metadata?.get('prism:publicationname'),
      metadata?.get('xmprights:owner'),
      metadata?.get('prism2:distributor'),
    ),
  )

  const publishedDate = coalesce(
    toNullableArray(
      metadata?.get('prism:publicationdate'),
      metadata?.get('dc:date'),
      metadata?.get('prism:availabledate'),
      metadata?.get('prism:coverdate'),
      metadata?.get('xmp:createdate'),
      metadata?.get('xap:createdate'),
      metadata?.get('pdf:creationdate'),
      info.CreationDate,
    ),
  )

  const modifiedDate = coalesce(
    toNullableArray(
      metadata?.get('xmp:modifydate'),
      metadata?.get('xap:modifydate'),
      metadata?.get('xmp:metadatadate'),
      metadata?.get('xap:metadatadate'),
      metadata?.get('dc:date'),
      metadata?.get('prism:modificationdate'),
      metadata?.get('pdf:moddate'),
      info.ModDate,
    ),
  )

  const description = coalesce(
    toNullableArray(
      metadata?.get('prism:teaser'),
      metadata?.get('prism:summary'),
      metadata?.get('prism:abstract'),
      metadata?.get('dc:description'),
      metadata?.get('xmp:description'),
      metadata?.get('xap:description'),
      metadata?.get('pdf:subject'),
      info.Subject,
    ),
  )

  return {
    title: mapNullable(title, metadataToString) ?? filename,
    author: mapNullable(author, metadataToString),
    publisher: mapNullable(publisher, metadataToArray),
    publishedDate: mapNullable(publishedDate, metadataToString),
    modifiedDate: mapNullable(modifiedDate, (m) =>
      metadataToString(m, { ifArray: (v) => v[v.length - 1] }),
    ),
    description: mapNullable(description, metadataToString),
  }
}
