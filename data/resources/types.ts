export interface SerializedResource {
  title: string
  url: string
  type: string[]
  source?: string
}

export type SerializedResources = SerializedResource[]

export interface Resource {
  title: string
  url: string
  type: string[]
  source: string
}

export type Resources = {
  [resourceId: string]: Resource
}
