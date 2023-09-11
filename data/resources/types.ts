export type ResourceType =
  | 'basics'
  | 'advanced'
  | 'how-to'
  | 'curiosity'
  | 'tool'
  | 'reference'
  | 'feed'

export interface SerializedResource {
  title: string
  url: string
  source?: string
}

export type SerializedResources = SerializedResource[]

export interface Resource {
  title: string
  url: string
  source: string
  // TODO :  non optional
  type?: ResourceType
}

export type Resources = {
  [resourceId: string]: Resource
}
