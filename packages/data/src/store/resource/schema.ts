export enum ResourceType {
  basics = 'basics',
  advanced = 'advanced',
  'how-to' = 'how-to',
  curiosity = 'curiosity',
  tool = 'tool',
  reference = 'reference',
  feed = 'feed',
}

export interface SerializedResource {
  title: string
  url: string
  source?: string
  type: ResourceType
}

export interface Resource {
  title: string
  url: string
  source: string
  type: ResourceType
}
