import { describe, test, expect } from 'vitest'
import { getLastExtraction } from '../src/feature/model'
import { getAll as getAllResources } from '../src/resource/model'

describe('Data extraction', async () => {
  const extractionUrls = await getLastExtraction()
    .then((extraction) => extraction?.getResults())
    .then((results) => results?.map((result) => result.url))
  const resourceUrls = await getAllResources().then((resources) =>
    resources.map((resource) => resource.url),
  )

  test('happened for all resources', () => {
    expect(extractionUrls).not.toBeUndefined()

    const extractionUrlsVsResourceUrlsDiff = new Set(extractionUrls).difference(
      new Set(resourceUrls),
    )

    expect(extractionUrlsVsResourceUrlsDiff.size).toBe(0)
  })
})
