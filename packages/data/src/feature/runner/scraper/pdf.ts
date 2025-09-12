import {
  toNullable,
  mapNullable,
  coalesce,
  toNullableItems,
} from '../../../common/nullable'
import { getPdfDocumentMetadata } from '../common/pdf'
import type { PDFMetadata } from '../../schema'

export interface GetPdfMetadataOptions {
  url: string
  source: Buffer
}

const toArray = <T>(value: T | T[]): T[] => {
  if (Array.isArray(value)) {
    return value
  }

  return list(value)
}

const list = <T>(value: T) => [value]

const toString = <T>(value: T | T[], fn: (value: T[]) => T = first): T =>
  Array.isArray(value) ? fn(value) : value

const at = <T>(value: T[], index: number) => value[index]

const first = <T>(value: T[]) => at(value, 0)

const last = <T>(value: T[]) => at(value, value.length - 1)

type ISO8601Date = string

type DateTime = string

type RDFAlt = string | { 'x-default': string; [key: string]: string }

export const getPdfMetadata = async ({
  url,
  source,
}: GetPdfMetadataOptions): Promise<PDFMetadata> => {
  const { info, metadata } = await getPdfDocumentMetadata(source)

  const title = coalesce(
    toNullableItems([
      info.Title,
      mapNullable(toNullable(metadata?.get<RDFAlt>('dc:title')), (t) =>
        typeof t === 'string' ? t : t['x-default'],
      ),
    ]),
  )

  console.log(metadata?.get<Record<string, string>>('dc:title'))

  const author = coalesce(
    toNullableItems([info.Author, metadata?.get<string[]>('dc:creator')]),
  )

  const publisher = coalesce(
    toNullableItems([
      metadata?.get<string[]>('dc:publisher'),
      metadata?.get<string[]>('prism2:issuingOrganization'),
      metadata?.get<string[]>('prism:publisher'),
      mapNullable(
        toNullable(metadata?.get<RDFAlt>('prism:publicationName')),
        (t) => (typeof t === 'string' ? t : t['x-default']),
      ),
      metadata?.get<string[]>('xmpRights:Owner'),
      metadata?.get<string[]>('prism2:distributor'),
    ]),
  )

  const publishedDate = coalesce(
    toNullableItems([
      metadata?.get<ISO8601Date>('prism:publicationDate'),
      metadata?.get<string[]>('dc:date'),
      metadata?.get<ISO8601Date>('prism:availableDate'),
      metadata?.get<ISO8601Date>('prism:coverDate'),
      metadata?.get<DateTime>('xmp:CreateDate'),
      metadata?.get<DateTime>('pdf:CreationDate'),
      info.CreationDate,
    ]),
  )

  const modifiedDate = coalesce(
    toNullableItems([
      metadata?.get<DateTime>('xmp:ModifyDate'),
      metadata?.get<DateTime>('xmp:MetadataDate'),
      metadata?.get<DateTime>('pdf:ModDate'),
      metadata?.get<DateTime>('dc:date'),
      metadata?.get<ISO8601Date>('prism:modificationDate'),
      info.ModDate,
    ]),
  )

  return {
    title: mapNullable(title, toString) || url.split('/').pop()!,
    author: mapNullable(author, toString),
    publisher: mapNullable(publisher, toArray),
    publishedDate: mapNullable(publishedDate, toString),
    modifiedDate: mapNullable(modifiedDate, (m) => toString(m, last)),
  }
}
