import { describe, test, expect } from 'vitest'
// import { listPaths, readPaths } from '../scripts/paths/read'
// import { readResources } from '../scripts/resources/read'
import { getRootPaths } from '../dist/model/path'
import { getAll } from '../dist/model/resource'
// import { } from '../dist/model'
// import type { Path } from '../dist'

/* const flattenPathResources = (path: Path) => {
  const pathResources: string[] = []

  const { main, resources, children } = path

  main && pathResources.push(...main)

  resources && pathResources.push(...resources)

  if (!children) return pathResources

  children.forEach((child) => {
    child.main && pathResources.push(...child.main)
    child.resources && pathResources.push(...child.resources)
  })

  return pathResources
} */

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
  // const paths = readPaths(listPaths())

  /* describe.each(paths)('$topic path', (path) => {
    test('Lists unique resources', () => {
      const { main, resources } = path
      if (main && resources) {
        const overlappingurls = main.filter((url) => resources.includes(url))
        expect(overlappingurls).toHaveLength(0)
      }
    })

    // HACK: running this only on top level paths
    test.runIf(path.topic.split('.').length === 1)(
      "Uses all topic's resources",
      () => {
        const pathResources = flattenPathResources(path)
        const pathSerializedResources = readResources(path.topic)
        const unusedResources = pathSerializedResources.filter(
          ({ url }) =>
            !pathResources.find((pathResource) => pathResource === url),
        )

        expect(unusedResources).toHaveLength(0)
        expect(pathResources).toHaveLength(pathSerializedResources.length)
      },
    )
  }) */
})
