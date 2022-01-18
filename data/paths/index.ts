import resources, { Resource } from '../resources'
import htmlcss from './html&css.json'
import webaccessibility from './webaccessibility.json'
import javascript from './javascript.json'
import typescript from './typescript.json'
import react from './react.json'
import reacttypescript from './react&typescript.json'
import next from './next.json'
import node from './node.json'
import git from './git.json'
import neovim from './neovim.json'

export interface Path {
  title: string
  resources: Array<keyof typeof resources>
  next?: Array<keyof typeof paths>
  prev?: Array<keyof typeof paths>
  asides?: Array<Aside>
}

export type Aside = Omit<Path, 'next' | 'prev' | 'asides'>

export interface PopulatedPath {
  title: string
  resources: Resource[]
  asides: Array<PopulatedAside>
  next: Paths
  prev: Paths
}

export type PopulatedAside = Omit<PopulatedPath, 'next' | 'prev' | 'asides'>

export type Paths = {
  [pathName: string]: Path
}

const paths = <Paths>{
  htmlcss,
  webaccessibility,
  javascript,
  typescript,
  react,
  reacttypescript,
  next,
  node,
  git,
  neovim,
}

export const populatePath = (path: Path): PopulatedPath => ({
  ...path,
  resources: path.resources
    .map((resourceId) => resources[resourceId])
    .filter(Boolean),
  asides: (path.asides || [])
    .map((aside) => ({
      ...aside,
      resources: aside.resources
        .map((asideResourceId) => resources[asideResourceId])
        .filter(Boolean),
    }))
    .filter(Boolean),
  next: (path.next || []).reduce((nextPaths, nextPathId) => {
    if (paths[nextPathId]) nextPaths[nextPathId] = paths[nextPathId]

    return nextPaths
  }, {} as Paths),
  prev: (path.prev || []).reduce((prevPaths, prevPathId) => {
    if (paths[prevPathId]) prevPaths[prevPathId] = paths[prevPathId]

    return prevPaths
  }, {} as Paths),
})

export const hasNextPaths = (path: PopulatedPath) => {
  return Boolean(Object.keys(path.next).length)
}

export const hasPrevPaths = (path: PopulatedPath) => {
  return Boolean(Object.keys(path.prev).length)
}

export default paths
