import type { ResourceData } from '@sherpa/data/resource/schema'
import config from '../../config'

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
    type: ResourceData['type']
    resources: ResourceData[]
  }
>

export const sortResourcesTypeGroups = (groups: ResourcesTypeGroups) =>
  config.resources.categoriesOrder
    .filter((groupType) => Boolean(groups[groupType]))
    .map((groupType) => groups[groupType])

export const groupResourcesByType = (resources: ResourceData[]) => {
  const groups = resources.reduce<ResourcesTypeGroups>(
    (groupedResources, resource) => {
      const { type } = resource

      if (!groupedResources[type]) {
        groupedResources[type] = {
          type,
          resources: [],
        }
      }

      groupedResources[type].resources.push(resource)

      return groupedResources
    },
    {} as ResourcesTypeGroups,
  )

  return sortResourcesTypeGroups(groups)
}
