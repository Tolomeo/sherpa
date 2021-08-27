import htmlcss from './html&css.json'
import javascript from './javascript.json'
import typescript from './typescript.json'
import reactredux from './react&redux.json'

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
  ...htmlcss,
  ...javascript,
  ...typescript,
  ...reactredux,
}

export default resources
