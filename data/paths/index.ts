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
  extras?: Array<PathExtra>
}

export type PathExtra = Omit<Path, 'next' | 'prev' | 'extras'>

export interface PopulatedPath {
  title: string
  resources: Resource[]
  extras: Array<PopulatedPathExtra>
  next: Paths
  prev: Paths
}

export type PopulatedPathExtra = Omit<PopulatedPath, 'next' | 'prev' | 'extras'>

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
  // populating resources data
  resources: path.resources
    .map((resourceId) => resources[resourceId])
    .filter(Boolean),
  // populating extra resources, those are optional
  extras: (path.extras || [])
    .map((extra) => ({
      ...extra,
      resources: extra.resources
        .map((extraResourceId) => resources[extraResourceId])
        // sorting alphabetically by resource title
        .sort((extraA, extraB) => {
          const titleA = extraA.title.toUpperCase()
          const titleB = extraB.title.toUpperCase()

          if (titleA > titleB) return 1
          else if (titleB > titleA) return -1

          return 0
        })
        .filter(Boolean),
    }))
    .filter(Boolean),
  // populating next paths, those are optional
  next: (path.next || []).reduce((nextPaths, nextPathId) => {
    if (paths[nextPathId]) nextPaths[nextPathId] = paths[nextPathId]

    return nextPaths
  }, {} as Paths),
  // populating prev paths, those are optional
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

export const hasExtras = (path: PopulatedPath) => {
  return Boolean(path.extras.length)
}

export default paths
