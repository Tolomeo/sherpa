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
    metadata?.get('dc:contributor') ||
    null
  // const date = info.CreationDate || metadata?.get('xmp:CreateDate') || null

  return { title, author, publisher }
}
