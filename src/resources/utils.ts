import { Resource } from '../../data/resources/types'

export const sortResources = (resources: Array<Resource>) =>
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
    resources: Array<Resource>
  }
>

const resourcesTypesGroupsOrder: Array<NonNullable<Resource['type']>> = [
  'basics',
  'advanced',
  'how-to',
  'curiosity',
  'tool',
  'reference',
  'feed',
]

export const sortResourcesTypeGroups = (groups: ResourcesTypeGroups) =>
  resourcesTypesGroupsOrder.map((groupType) => groups[groupType])

const resourceTypeToGroupTitle: Record<
  NonNullable<Resource['type']>,
  string
> = {
  basics: "There's more",
  advanced: 'Beyond basics',
  'how-to': 'How do they do it',
  curiosity: 'Nice to know',
  tool: 'Work smarter, not harder',
  reference: 'Great bookmarks',
  feed: 'Stay in the loop',
}

export const groupResourcesByType = (resources: Array<Resource>) => {
  const groups = resources.reduce((groupedResources, resource) => {
    const { type } = resource

    // TODO remove this
    if (!type) return groupedResources

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
