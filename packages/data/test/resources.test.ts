import { describe, test, expect } from 'vitest'
import { getLastExtraction } from '../src/extraction/model'
import type { ExtractionResultData } from '../src/extraction/schema'
import { ExtractionResultDataSchema } from '../src/extraction/schema'
import { getAll as getAllResources } from '../src/resource/model'
import type { ResourceData } from '../types/resource'
import { ResourceDataSchema } from '../types/resource'

describe('Resources', async () => {
  const lastExtraction = await getLastExtraction()
  const resources = await getAllResources()

  test.each(resources)('$url', async (resource) => {
    const extractionResult = await lastExtraction?.getResult(resource.url)

    expect(extractionResult).not.toBeUndefined()
    expect(resource.data).toMatchExtractedData(extractionResult!.data)
  })
})

expect.extend({
  toMatchExtractedData(
    resourceData: ResourceData,
    extractionResultData: ExtractionResultData,
  ) {
    const resourceDataValidation = ResourceDataSchema.safeParse(resourceData)

    if (resourceDataValidation.error) {
      throw new Error(`Invalid resource data received`)
    }

    const extractionResultDataValidation =
      ExtractionResultDataSchema.safeParse(extractionResultData)

    if (extractionResultDataValidation.error) {
      throw new Error(`Invalid extraction result data received`)
    }

    if (!extractionResultData.success) {
      return {
        pass: false,
        message: () =>
          [
            `Data extraction failed with the error`,
            extractionResultData.error,
          ].join('\n'),
      }
    }

    const resourceTitle = resourceData.data.title
    const dataExtractionDetail = extractionResultData.detail

    switch (dataExtractionDetail.source) {
      case 'PdfFile': {
        const match =
          dataExtractionDetail.metadata.title.includes(resourceTitle)

        return {
          pass: match,
          message: () =>
            match
              ? `Resource title "${resourceTitle}" successfully found in pdf data extraction metadata`
              : [
                  `Resource title "${resourceTitle}" was not found in pdf data extraction metadata`,
                  this.utils.printDiffOrStringify(
                    dataExtractionDetail.metadata.title,
                    resourceTitle,
                  ),
                ].join('\n'),
        }
      }
      case 'Html': {
        const match = Boolean(
          Object.values(dataExtractionDetail.metadata.title).find((title) =>
            title ? title.includes(resourceTitle) : false,
          ),
        )

        return {
          pass: match,
          message: () =>
            match
              ? `Resource title "${resourceTitle}" successfully found in Html data extraction metadata`
              : [
                  `Resource title "${resourceTitle}" was not found in Html data extraction metadata`,
                  this.utils.printDiffOrStringify(
                    dataExtractionDetail.metadata.title,
                    resourceTitle,
                  ),
                ].join('\n'),
        }
      }
      case 'YoutubeDataAPIV3': {
        const match =
          dataExtractionDetail.metadata.title.includes(resourceTitle)

        return {
          pass: match,
          message: () =>
            match
              ? `Resource title "${resourceTitle}" successfully found in YoutubeDataAPIV3 data extraction metadata`
              : [
                  `Resource title "${resourceTitle}" was not found in YoutubeDataAPIV3 data extraction metadata`,
                  this.utils.printDiffOrStringify(
                    dataExtractionDetail.metadata.title,
                    resourceTitle,
                  ),
                ].join('\n'),
        }
      }
      case 'UdemyAffiliateAPI': {
        const match =
          dataExtractionDetail.metadata.title.includes(resourceTitle)

        return {
          pass: match,
          message: () =>
            match
              ? `Resource title "${resourceTitle}" successfully found in UdemyAffiliateAPI data extraction metadata`
              : [
                  `Resource title "${resourceTitle}" was not found in UdemyAffiliateAPI data extraction metadata`,
                  this.utils.printDiffOrStringify(
                    dataExtractionDetail.metadata.title,
                    resourceTitle,
                  ),
                ].join('\n'),
        }
      }
    }
  },
})
