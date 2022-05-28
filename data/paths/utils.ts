import resources from '../resources'
import { SerializedPaths, Paths } from './types'

export const parsePaths = <T extends SerializedPaths<string>>(
  serializedPaths: T,
) =>
  Object.entries(serializedPaths).reduce(
    (paths, [pathName, serializedPath]) => {
      paths[pathName] = {
        ...serializedPath,
        // populating resources data
        resources: serializedPath.resources.map((resourceId) => {
          const resource = resources[resourceId]

          if (!resource)
            throw new Error(
              `deserializePathError: resource "${resourceId}" not found`,
            )

          return resource
        }),
        // populating extra resources, those are optional
        extras: (serializedPath.extras || []).map((extra) => ({
          ...extra,
          resources: extra.resources
            .map((extraResourceId) => {
              const extraResource = resources[extraResourceId]

              if (!extraResource)
                throw new Error(
                  `deserializePathError: extra resource "${extraResourceId}" not found`,
                )

              return extraResource
            })
            // sorting alphabetically by resource title
            .sort((resourceA, resourceB) => {
              const titleA = resourceA.title.toUpperCase()
              const titleB = resourceB.title.toUpperCase()

              if (titleA > titleB) return 1
              else if (titleA < titleB) return -1

              return 0
            }),
        })),
        // populating next paths, those are optional
        next: (serializedPath.next || []).reduce((nextPaths, nextPathId) => {
          if (serializedPaths[nextPathId])
            nextPaths[nextPathId] = serializedPaths[nextPathId]

          return nextPaths
        }, {} as SerializedPaths<keyof T>),
        // populating prev paths, those are optional
        prev: (serializedPath.prev || []).reduce((prevPaths, prevPathId) => {
          if (serializedPaths[prevPathId])
            prevPaths[prevPathId] = serializedPaths[prevPathId]

          return prevPaths
        }, {} as SerializedPaths<keyof T>),
      }

      return paths
    },
    {} as Paths<keyof T>,
  )
