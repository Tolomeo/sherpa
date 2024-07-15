import { describe, test, expect } from 'vitest'
import { getRoots } from '../src/topic'
import { getAll } from '../src/resource'

describe('Paths', async () => {
  const rootPaths = await getRoots()

  test('Use all available resources', async () => {
    const allResources = await getAll()
    const allResourceUrls = new Set<string>(allResources.map(({ url }) => url))

    const allUniquePathResourceUrls = new Set<string>()
    for (const rootPath of rootPaths) {
      const pathResources = await rootPath.getResources()
      for (const pathResource of pathResources) {
        allUniquePathResourceUrls.add(pathResource)
      }
    }

    const allUniquePathResourceUrlsArray = [...allUniquePathResourceUrls].sort()
    const allResourceUrlsArray = [...allResourceUrls].sort()
    expect(allUniquePathResourceUrlsArray).toEqual(allResourceUrlsArray)
  })

  describe.each(rootPaths)('$topic', (path) => {
    test('Lists unique resources', async () => {
      const pathResources = await path.getResources()
      const uniqueResources = [...new Set(pathResources)]

      expect(pathResources).toEqual(uniqueResources)
    })
  })
})
