import type { Metadata } from 'pdfjs-dist/types/src/display/metadata'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { fileTypeFromBuffer } from 'file-type'

// standard internal date format used in PDF documents
// format D:YYYYMMDDHHmmSSOHH'mm
// see https://www.coherentpdf.com/cpdfmanual/cpdfmanualap1.html
// TODO: create specific literal type?
type PDFDate = string

export interface PDFDocumentInfo {
  Title?: string
  Author?: string
  Subject?: string
  Keywords?: string
  Creator?: string
  Producer?: string
  CreationDate?: PDFDate
  ModDate?: PDFDate
  // Trapped
}

export interface PDFDocumentXMP extends Metadata {
  get: <T extends string | string[] | Record<string, string>>(
    key: string,
  ) => T | null
  getRaw: () => string
}

export interface PDFDocumentMetadata {
  info: PDFDocumentInfo
  metadata: PDFDocumentXMP | null
}

const validateBuffer = async (buffer: Buffer) => {
  const file = await fileTypeFromBuffer(buffer)

  if (!file || file.ext !== 'pdf' || file.mime !== 'application/pdf') {
    throw new Error(
      `The received buffer is not a pdf. The buffer is instead a ${JSON.stringify(
        file,
      )} filetype`,
    )
  }
}

export const getPdfDocumentMetadata = async (
  buffer: Buffer,
): Promise<PDFDocumentMetadata> => {
  await validateBuffer(buffer)

  const pdf = await getDocument(new Uint8Array(buffer)).promise
  const meta: PDFDocumentMetadata = await pdf.getMetadata()

  return meta
}
