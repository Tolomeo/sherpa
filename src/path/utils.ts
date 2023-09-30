import { PopulatedPath, Path, Resource, ResourceType } from './types'

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

// TODO: move to config
const resourcesTypesGroupsOrder: Array<NonNullable<Resource['type']>> = [
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
    .filter((groupType) => !!groups[groupType])
    .map((groupType) => groups[groupType])

// TODO: move to config
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

export const groupResourcesByType = (resources: Array<Resource>) => {
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

export const populatePath = (
  path: Path,
  resources: Resource[],
): PopulatedPath => {
  const resourcesMap = resources.reduce((map, resource) => {
    map[resource.url] = resource
    return map
  }, {} as Record<Resource['url'], Resource>)

  return {
    ...path,
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

      return path.children.map(({ title, main, resources }) => {
        return {
          title,
          main: (() => {
            if (!main) return null

            return main.map((resourceId) => {
              return resourcesMap[resourceId]
            })
          })(),
          resources: (() => {
            if (!resources) return null

            return sortResources(
              resources.map((resourceId) => {
                return resourcesMap[resourceId]
              }),
            )
          })(),
        }
      })
    })(),
  }
}
