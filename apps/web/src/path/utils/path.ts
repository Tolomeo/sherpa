import config from '../../config'
import type { PopulatedPath, Path, ResourceData } from '../types'

export const sortResources = (resources: ResourceData[]) =>
  [...resources].sort((resourceA, resourceB) => {
    const titleA = resourceA.title.toUpperCase()
    const titleB = resourceB.title.toUpperCase()

    if (titleA > titleB) return 1
    else if (titleA < titleB) return -1

    return 0
  })

export type ResourcesTypeGroups = Record<
  NonNullable<ResourceData['type']>,
  {
    title: string
    resources: ResourceData[]
  }
>

export const sortResourcesTypeGroups = (groups: ResourcesTypeGroups) =>
  config.resources.categoriesOrder
    .filter((groupType) => Boolean(groups[groupType]))
    .map((groupType) => groups[groupType])

export const groupResourcesByType = (resources: ResourceData[]) => {
  const groups = resources.reduce((groupedResources, resource) => {
    const { type } = resource

    if (!groupedResources[type]) {
      groupedResources[type] = {
        title: config.resources.categoriesTitles[type],
        resources: [],
      }
    }

    groupedResources[type].resources.push(resource)

    return groupedResources
  }, {} as ResourcesTypeGroups)

  return sortResourcesTypeGroups(groups)
}

export const populatePath = (
  path: Path,
  resources: ResourceData[],
): PopulatedPath => {
  const resourcesMap = resources.reduce<
    Record<ResourceData['url'], ResourceData>
  >((map, resource) => {
    map[resource.url] = resource
    return map
  }, {})

  return {
    ...path,
    title: config.paths.topicsTitles[path.topic],
    main: (() => {
      if (!path.main) return null

      return path.main.map((resourceId) => {
        return resourcesMap[resourceId]
      })
    })(),
    resources: (() => {
      if (!path.resources) return null

      return groupResourcesByType(
        path.resources.map((resourceId) => {
          return resourcesMap[resourceId]
        }),
      ).map((group) => ({
        ...group,
        resources: sortResources(group.resources),
      }))
    })(),
    children: (() => {
      if (!path.children) return null

      return path.children.map(({ topic, main, resources: childResources }) => {
        return {
          title: config.paths.topicsTitles[topic],
          main: (() => {
            if (!main) return null

            return main.map((resourceId) => {
              return resourcesMap[resourceId]
            })
          })(),
          resources: (() => {
            if (!childResources) return null

            return sortResources(
              childResources.map((resourceId) => {
                return resourcesMap[resourceId]
              }),
            )
          })(),
        }
      })
    })(),
  }
}
