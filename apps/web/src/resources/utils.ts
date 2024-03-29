import type { Resource } from '@sherpa/data/types'
import { ResourceType } from '@sherpa/data/types'

export const sortResources = (resources: Resource[]) =>
  [...resources].sort((resourceA, resourceB) => {
    const titleA = resourceA.title.toUpperCase()
    const titleB = resourceB.title.toUpperCase()

    if (titleA > titleB) return 1
    else if (titleA < titleB) return -1

    return 0
  })

export type ResourcesTypeGroups = Record<
  NonNullable<Resource['type']>,
  {
    title: string
    resources: Resource[]
  }
>

const resourcesTypesGroupsOrder: NonNullable<Resource['type']>[] = [
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
  NonNullable<Resource['type']>,
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

export const groupResourcesByType = (resources: Resource[]) => {
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
}
