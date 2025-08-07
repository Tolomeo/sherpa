import type { ResourceData } from '@sherpa/data/resource'
import type { ResourceTypeName } from '../../config'
import { getResourceTypeName } from '../../resources/utils'
import config from '../../config'

export type ResourcesTypeGroups = Record<
  ResourceTypeName,
  {
    type: ResourceTypeName
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
      const typeName = getResourceTypeName(resource)

      if (!groupedResources[typeName]) {
        groupedResources[typeName] = {
          type: typeName,
          resources: [],
        }
      }

      groupedResources[typeName].resources.push(resource)

      return groupedResources
    },
    {} as ResourcesTypeGroups,
  )

  return sortResourcesTypeGroups(groups)
}
