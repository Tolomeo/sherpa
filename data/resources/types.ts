export const resourceType = [
  'course',
  'tutorial',
  'guide',
  'game',
  'book',
  'example',
  'collection',
  'series',
  'reference',
  'community',
  'exercise',
  'blog',
  'generator',
  'opinion',
] as const

export type ResourceType = typeof resourceType[number]

export interface SerializedResource {
  title: string
  url: string
  type: ResourceType[]
  source?: string
}

export type SerializedResources = SerializedResource[]

export interface Resource {
  title: string
  url: string
  type: ResourceType[]
  source: string
}

export type Resources = {
  [resourceId: string]: Resource
}
