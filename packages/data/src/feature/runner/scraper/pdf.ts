import { getPdfDocumentMetadata } from '../common/pdf'
import type { PDFMetadata } from '../../schema'

export interface GetPdfMetadataOptions {
  url: string
  source: Buffer
}

export const getPdfMetadata = async ({
  url,
  source,
}: GetPdfMetadataOptions): Promise<PDFMetadata> => {
  const { info, metadata } = await getPdfDocumentMetadata(source)

  const title = info.Title || metadata?.get('dc:title') || url.split('/').pop()!
  const author = info.Author || metadata?.get('dc:creator') || null
  const publisher =
    metadata?.get('dc:publisher') ||
    metadata?.get('prism:publisher') ||
    metadata?.get('prism:publicationName') ||
    metadata?.get('xmpRights:Owner') ||
    null
  const publishedDate =
    metadata?.get('prism:publicationDate') ||
    // TODO: this could be an array, take the first if so
    metadata?.get('dc:date') ||
    metadata?.get('prism:availableDate') ||
    metadata?.get('prism:coverDate') ||
    metadata?.get('xmp:CreateDate') ||
    metadata?.get('pdf:CreationDate') ||
    info.CreationDate ||
    null
  const modifiedDate =
    metadata?.get('xmp:ModifyDate') ||
    metadata?.get('xmp:MetadataDate') ||
    metadata?.get('pdf:ModDate') ||
    // TODO: this could be an array. If it is, take the last item
    metadata?.get('dc:date') ||
    metadata?.get('prism:modificationDate') ||
    info.ModDate ||
    null

  return { title, author, publisher, publishedDate, modifiedDate }
}
