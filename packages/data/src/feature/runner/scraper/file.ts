import { fileTypeFromBuffer } from 'file-type'

export interface PDFMetadata {
  title: string
}

export interface GetPdfMetadataOptions {
  url: string
  source: Buffer
}

export const getPdfMetadata = async ({
  url,
  source,
}: GetPdfMetadataOptions): Promise<PDFMetadata> => {
  const file = await fileTypeFromBuffer(source)

  if (!file || file.ext !== 'pdf' || file.mime !== 'application/pdf') {
    throw new Error(
      `The received buffer is not a pdf. The buffer is instead a ${JSON.stringify(
        file,
      )} filetype`,
    )
  }

  return { title: url.split('/').pop()! }
}
