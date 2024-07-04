import { describe, test, expect } from 'vitest'
import { getRootPaths } from '../dist/model/path'
import { getAll } from '../dist/model/resource'

describe('Paths', async () => {
  const rootPaths = await getRootPaths()

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
