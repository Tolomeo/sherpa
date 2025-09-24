import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { getParents } from '../src/topic'
import { getAllById } from '../src/resource'
import FeatureExtractionRunner from '../src/feature/runner'

describe('Resources', async () => {
  const topics = await getParents()
  let featureExtraction: FeatureExtractionRunner

  beforeAll(() => {
    featureExtraction = new FeatureExtractionRunner()
  })

  afterAll(async () => {
    await featureExtraction.teardown()
  })

  describe.each(topics)('$name resources', async (topic) => {
    const pathResourceIds = await topic.getResources()
    const pathResources = await getAllById(...pathResourceIds)

    /* test.each(pathResources)(
      '$url',
      async (resource) => {
        const resourceData = resource.data
        const healthcheckStrategy = resource.healthcheck

        const resourceHealthcheck = await featureExtraction.run(
          resourceData.url,
          healthcheckStrategy,
        )
        expect(resourceHealthcheck.success).toBe(true)
        expect(resourceHealthcheck.data).toBeValidScrapeResultForTitle(
          resourceData.data.title,
        )
      },
      150_000,
    ) */
  })
})
