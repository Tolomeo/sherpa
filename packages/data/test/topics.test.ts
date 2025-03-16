import { describe, test, expect } from 'vitest'
import { getParents } from '../src/topic'
import { getAll } from '../src/resource'

describe('Paths', async () => {
  const parents = await getParents()

  test('Use all available resources', async () => {
    const allResources = await getAll()
    const allResourcesIds = new Set<string>(allResources.map(({ id }) => id))

    const allUniqueTopicsResourceIds = new Set<string>()
    for (const parent of parents) {
      const topicResources = await parent.getResources()
      for (const topicResource of topicResources) {
        allUniqueTopicsResourceIds.add(topicResource)
      }
    }

    const allUniquePathResourceUrlsArray = [
      ...allUniqueTopicsResourceIds,
    ].sort()
    const allResourceUrlsArray = [...allResourcesIds].sort()
    expect(allUniquePathResourceUrlsArray).toEqual(allResourceUrlsArray)
  })

  describe.each(parents)('$name', (path) => {
    test('Lists unique resources', async () => {
      const pathResources = await path.getResources()
      const uniqueResources = [...new Set(pathResources)]

      expect(pathResources).toEqual(uniqueResources)
    })
  })
})
