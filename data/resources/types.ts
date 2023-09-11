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
  // TODO : enum and non optional
  type?: string
}

export type Resources = {
  [resourceId: string]: Resource
}
