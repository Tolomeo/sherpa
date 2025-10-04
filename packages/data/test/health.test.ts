import { describe, test, expect } from 'vitest'
import { getLastExtraction } from '../src/extraction/model'
import type { ExtractionResult } from '../src/extraction/model'
import { getAll as getAllResources } from '../src/resource/model'
import type Resource from '../src/resource'

describe('Resources', async () => {
  const lastExtraction = await getLastExtraction()
  const resources = await getAllResources()

  test.each(resources)('$url', async (resource) => {
    const extractionResult = await lastExtraction?.getResult(resource.url)

    expect(extractionResult).not.toBeFalsy()
    expect(resource).toBeHealthy(extractionResult!)
  })
})

expect.extend({
  toBeHealthy(resource: Resource, extractionResult: ExtractionResult) {
    const extractionResultData = extractionResult.data

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

    const pass = resource.isHealthy(extractionResult)
    return {
      pass,
      message: () =>
        pass
          ? `Resource "${resource.url}" data matches extracted metadata`
          : [
              `Resource "${resource.url}" data does not match extracted metadata`,
              this.utils.printDiffOrStringify(
                extractionResultData.detail.metadata,
                resource.document.data.title,
              ),
            ].join('\n'),
    }
  },
})
