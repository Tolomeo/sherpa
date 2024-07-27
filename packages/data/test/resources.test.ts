import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { getParents } from '../src/topic'
import { getById } from '../src/resource'
import HealthCheck from '../src/healthcheck/runner'

describe('Resources', async () => {
  const [topics] = await getParents()
  let healthCheck: HealthCheck

  beforeAll(() => {
    healthCheck = new HealthCheck()
  })

  afterAll(async () => {
    await healthCheck.teardown()
  })

  describe.each([topics])('$topic resources', async (topic) => {
    const pathResourceUrls = await topic.getResources()
    const pathResources = await Promise.all(
      pathResourceUrls.map((url) => getById(url)),
    )

    test.each(pathResources)(
      '$url',
      async (resource) => {
        const resourceData = resource.data
        const healthcheckStrategy = resource.healthcheck

        const resourceHealthcheck = await healthCheck.run(
          resourceData.url,
          healthcheckStrategy,
        )

        expect(resourceHealthcheck).toMatchObject({
          url: resourceData.url,
          success: true,
          data: {
            title: expect.stringContaining(resourceData.title) as string,
          },
        })
      },
      150_000,
    )
  })
})
