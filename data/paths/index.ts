import resources, { Resource } from '../resources'
import { SerializedPath, SerializedPaths, Path, Paths } from './types'
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

const serializedPaths = {
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
}

export const parsePaths = <T extends SerializedPaths<any>>(
  serializedPaths: T,
) =>
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
        }, {} as SerializedPaths<typeof serializedPaths>),
        // populating prev paths, those are optional
        prev: (serializedPath.prev || []).reduce((prevPaths, prevPathId) => {
          if (serializedPaths[prevPathId])
            prevPaths[prevPathId] = serializedPaths[prevPathId]

          return prevPaths
        }, {} as SerializedPaths<typeof serializedPaths>),
      }

      return paths
    },
    {} as Paths<typeof serializedPaths>,
  )

const paths = parsePaths(
  serializedPaths as SerializedPaths<keyof typeof serializedPaths>,
)

export const hasNextPaths = (path: Path<typeof serializedPaths>) => {
  return Boolean(Object.keys(path.next).length)
}

export const hasPrevPaths = (path: Path<typeof serializedPaths>) => {
  return Boolean(Object.keys(path.prev).length)
}

export const hasExtras = (path: Path<typeof serializedPaths>) => {
  return Boolean(path.extras.length)
}

export default paths
