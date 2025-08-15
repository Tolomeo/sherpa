import { fileTypeFromBuffer } from 'file-type'

export interface FromPDFBufferOptions {
  url: string
  buffer: Buffer
}

export const fromPDFBuffer = async ({ url, buffer }: FromPDFBufferOptions) => {
  const file = await fileTypeFromBuffer(buffer)

  if (!file || file.ext !== 'pdf' || file.mime !== 'application/pdf') {
    throw new Error(
      `The received buffer is not a pdf. The buffer is instead a ${JSON.stringify(
        file,
      )} filetype`,
    )
  }

  return { title: url.split('/').pop()! }
}
