import resources, { Resource } from '../resources'
import htmlcss from './htmlcss.json'
import webaccessibility from './webaccessibility.json'
import javascript from './javascript.json'
import typescript from './typescript.json'
import react from './react.json'
import reacttypescript from './reacttypescript.json'
import next from './next.json'
import node from './node.json'
import git from './git.json'
import regex from './regex.json'
import neovim from './neovim.json'
import lua from './lua.json'

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

export type SerializedPaths = Record<string, SerializedPath>

export type Paths = Record<string, Path>

export const parsePaths = (serializedPaths: SerializedPaths): Paths =>
  Object.entries(serializedPaths).reduce(
    (paths, [pathName, serializedPath]) => {
      paths[pathName] = {
        ...serializedPath,
        // populating resources data
        resources: serializedPath.resources.map((resourceId) => {
          const resource = resources[resourceId]

          if (!resource)
            throw new Error(
              `deserializePathError: resource "${resourceId}" not found`,
            )

          return resource
        }),
        // populating extra resources, those are optional
        extras: (serializedPath.extras || []).map((extra) => ({
          ...extra,
          resources: extra.resources
            .map((extraResourceId) => {
              const extraResource = resources[extraResourceId]

              if (!extraResource)
                throw new Error(
                  `deserializePathError: extra resource "${extraResourceId}" not found`,
                )

              return extraResource
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
        next: (serializedPath.next || []).reduce((nextPaths, nextPathId) => {
          if (serializedPaths[nextPathId])
            nextPaths[nextPathId] = serializedPaths[nextPathId]

          return nextPaths
        }, {} as SerializedPaths),
        // populating prev paths, those are optional
        prev: (serializedPath.prev || []).reduce((prevPaths, prevPathId) => {
          if (serializedPaths[prevPathId])
            prevPaths[prevPathId] = serializedPaths[prevPathId]

          return prevPaths
        }, {} as SerializedPaths),
      }

      return paths
    },
    {} as Paths,
  )

const paths = parsePaths({
  htmlcss,
  webaccessibility,
  javascript,
  typescript,
  react,
  reacttypescript,
  next,
  node,
  git,
  regex,
  neovim,
  lua,
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
