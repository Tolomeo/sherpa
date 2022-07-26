export const resourceTypes = {
  course: {
    title: 'course',
    description: '',
  },
  tutorial: { title: 'tutorial', description: '' },
  guide: { title: 'guide', description: '' },
  game: { title: 'game', description: '' },
  book: { title: 'book', description: '' },
  example: { title: 'example', description: '' },
  collection: { title: 'collection', description: '' },
  series: { title: 'series', description: '' },
  reference: { title: 'reference', description: '' },
  community: { title: 'community', description: '' },
  exercise: { title: 'exercise', description: '' },
  blog: { title: 'blog', description: '' },
  generator: { title: 'generator', description: '' },
  opinion: { title: 'opinion', description: '' },
} as const

export type ResourceType = keyof typeof resourceTypes

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
