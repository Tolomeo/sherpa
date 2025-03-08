import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { getParents } from '../src/topic'
import { getAllById } from '../src/resource'
import HealthCheck from '../src/healthcheck/runner'

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
        expect(resourceHealthcheck.success).toBe(true)
        expect(resourceHealthcheck.data!).toBeValidScrapeResultForTitle(
          resourceData.title,
        )
      },
      150_000,
    )
  })
})
