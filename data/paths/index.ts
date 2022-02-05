import resources, { Resource, deserializeResource } from '../resources'
import htmlcss from './htmlcss.json'
import webaccessibility from './webaccessibility.json'
import javascript from './javascript.json'
import typescript from './typescript.json'
import react from './react.json'
import reacttypescript from './reacttypescript.json'
import next from './next.json'
import node from './node.json'
import git from './git.json'
import neovim from './neovim.json'

export interface SerializedPath {
  title: string
  resources: Array<keyof typeof resources>
  next?: Array<keyof typeof paths>
  prev?: Array<keyof typeof paths>
  extras?: Array<SerializedPathExtra>
}

export type SerializedPathExtra = Omit<
  SerializedPath,
  'next' | 'prev' | 'extras'
>

export interface Path {
  title: string
  resources: Resource[]
  extras: Array<PathExtra>
  next: SerializedPaths
  prev: SerializedPaths
}

export type PathExtra = Omit<Path, 'next' | 'prev' | 'extras'>

export type SerializedPaths = {
  [pathName: string]: SerializedPath
}

const paths = <SerializedPaths>{
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

export const deserializePath = (path: SerializedPath): Path => ({
  ...path,
  // populating resources data
  resources: path.resources.map((resourceId) => {
    const resource = resources[resourceId]

    if (!resource)
      throw new Error(
        `deserializePathError: resource "${resourceId}" not found`,
      )

    return deserializeResource(resource)
  }),
  // populating extra resources, those are optional
  extras: (path.extras || []).map((extra) => ({
    ...extra,
    resources: extra.resources
      .map((extraResourceId) => {
        const extraResource = resources[extraResourceId]

        if (!extraResource)
          throw new Error(
            `deserializePathError: extra resource "${extraResourceId}" not found`,
          )

        return deserializeResource(extraResource)
      })
      // sorting alphabetically by resource title
      .sort((resourceA, resourceB) => {
        const titleA = resourceA.title.toUpperCase()
        const titleB = resourceB.title.toUpperCase()

        if (titleA > titleB) return 1
        else if (titleA < titleB) return -1

        return 0
      }),
  })),
  // populating next paths, those are optional
  next: (path.next || []).reduce((nextPaths, nextPathId) => {
    if (paths[nextPathId]) nextPaths[nextPathId] = paths[nextPathId]

    return nextPaths
  }, {} as SerializedPaths),
  // populating prev paths, those are optional
  prev: (path.prev || []).reduce((prevPaths, prevPathId) => {
    if (paths[prevPathId]) prevPaths[prevPathId] = paths[prevPathId]

    return prevPaths
  }, {} as SerializedPaths),
})

export const hasNextPaths = (path: Path) => {
  return Boolean(Object.keys(path.next).length)
}

export const hasPrevPaths = (path: Path) => {
  return Boolean(Object.keys(path.prev).length)
}

export const hasExtras = (path: Path) => {
  return Boolean(path.extras.length)
}

export default paths
