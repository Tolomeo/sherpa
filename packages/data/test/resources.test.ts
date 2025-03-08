import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { getParents } from '../src/topic'
import { getAllById } from '../src/resource'
import HealthCheck from '../src/healthcheck/runner'
import type { ScrapeResult } from '../src/healthcheck/runner/common'

describe('Resources', async () => {
  const topics = await getParents()
  let healthCheck: HealthCheck

  beforeAll(() => {
    healthCheck = new HealthCheck()
  })

  afterAll(async () => {
    await healthCheck.teardown()
  })

  describe.each(topics)('$name resources', async (topic) => {
    const pathResourceIds = await topic.getResources()
    const pathResources = await getAllById(...pathResourceIds)

    test.each(pathResources)(
      '$url',
      async (resource) => {
        const resourceData = resource.data
        const healthcheckStrategy = resource.healthcheck

        const resourceHealthcheck = await healthCheck.run(
          resourceData.url,
          healthcheckStrategy,
        )
        const containsResourceTitle = ({
          title,
          documentTitle,
          metadataTitle,
          displayTitle,
        }: ScrapeResult) =>
          [title, documentTitle, metadataTitle, displayTitle].some((t) =>
            t ? t.includes(resourceData.title) : false,
          )

        expect(resourceHealthcheck.success).toBe(true)
        expect(resourceHealthcheck.data!).toSatisfy(containsResourceTitle)
      },
      150_000,
    )
  })
})
