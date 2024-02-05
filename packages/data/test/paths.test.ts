import { describe, test, expect } from 'vitest'
import { listPaths, readPaths } from '../scripts/paths/read'
import { readResources } from '../scripts/resources/read'
import type { Path } from '../dist'

const flattenPathResources = (path: Path) => {
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
}

describe('Paths', () => {
  const paths = readPaths(listPaths())

  describe.each(paths)('$topic path', (path) => {
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
  })
})
