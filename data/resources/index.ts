import htmlcss from './html&css.json'
import webaccessibility from './webaccessibility.json'
import javascript from './javascript.json'
import typescript from './typescript.json'
import react from './react.json'
import next from './next.json'
import node from './node.json'
import git from './git.json'
import neovim from './neovim.json'

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
  ...webaccessibility,
  ...javascript,
  ...typescript,
  ...react,
  ...next,
  ...node,
  ...git,
  ...neovim,
}

export default resources
