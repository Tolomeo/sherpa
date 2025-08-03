import type { ResourceData } from '@sherpa/data/resource'
import type { ResourceTypeName } from '../config'

export const getResourceTypeName = (resource: ResourceData) => {
  const { type } = resource

  let typeName: ResourceTypeName

  switch (type.name) {
    case 'knowledge':
      typeName = `${type.name}.${type.variant}`
      break
    case 'reference':
      typeName = `${type.name}.${type.variant}`
      break
    default:
      typeName = type.name
  }

  return typeName
}

/* export type ResourcesTypeGroups = Record<
  NonNullable<ResourceData['type']>,
  {
    title: string
    resources: ResourceData[]
  }
>

const resourcesTypesGroupsOrder: NonNullable<ResourceData['type']>[] = [
  ResourceType.basics,
  ResourceType.advanced,
  ResourceType['how-to'],
  ResourceType.curiosity,
  ResourceType.tool,
  ResourceType.reference,
  ResourceType.feed,
]

export const sortResourcesTypeGroups = (groups: ResourcesTypeGroups) =>
  resourcesTypesGroupsOrder
    .filter((groupType) => Boolean(groups[groupType]))
    .map((groupType) => groups[groupType])

const resourceTypeToGroupTitle: Record<
  NonNullable<ResourceData['type']>,
  string
> = {
  basics: 'Fundamentals',
  advanced: 'Beyond basics',
  'how-to': 'How do they do it',
  curiosity: 'Nice to know',
  tool: 'Work smarter, not harder',
  reference: 'Great bookmarks',
  feed: 'Stay in the loop',
}

export const groupResourcesByType = (resources: ResourceData[]) => {
  const groups = resources.reduce((groupedResources, resource) => {
    const { type } = resource

    if (!groupedResources[type]) {
      groupedResources[type] = {
        title: resourceTypeToGroupTitle[type],
        resources: [],
      }
    }

    groupedResources[type].resources.push(resource)

    return groupedResources
  }, {} as ResourcesTypeGroups)

  return sortResourcesTypeGroups(groups)
} */
