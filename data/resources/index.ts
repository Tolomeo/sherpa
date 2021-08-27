import htmlcss from './html&css.json'
import javascript from './javascript.json'
import typescript from './typescript.json'

export type ResourceType =
  | 'video'
  | 'challenge'
  | 'reading'
  | 'interactive'
  | 'book'
  | 'example'
  | 'collection'

export interface Resource {
  title: string
  url: string
  type: ResourceType[]
  source: string
}

export type Resources = {
  [resourceId: string]: Resource
}

const resources = <Resources>{
  ...javascript,
  ...typescript,
  ...htmlcss,
}

export default resources
