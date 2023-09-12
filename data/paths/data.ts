import fs from 'fs'
import path from 'path'
import resources, { Resource } from '../resources'
import {
  SerializedSubPath,
  SerializedSubTopic,
  SerializedPath,
  Path,
  SubPath,
  SubTopic,
  PathsList,
} from './types'
import { validateSerializedPath } from './schema'

export const isSerializedSubTopic = (
  pathExtra: SerializedSubPath | SerializedSubTopic,
): pathExtra is SerializedSubPath => {
  return 'resources' in pathExtra
}

export const isSerializedSubPath = (
  pathExtra: SerializedSubPath | SerializedSubTopic,
): pathExtra is SerializedSubPath => {
  return 'main' in pathExtra
}

const parseSerializedPathResources = (
  serializedPathResources?: SerializedPath['resources'],
) => {
  if (!serializedPathResources) return null

  return serializedPathResources.map((resourceId) => {
    const resource = resources[resourceId]

    /* if (!resource)
        throw new Error(
          `${pathName} path error: resource not found error[ ${resourceId} ]`,
        ) */

    return resource
  })
}

const parseSerializedPathLogo = (serializedPathLogo: SerializedPath['logo']) =>
  serializedPathLogo || null

const parseSerializedPathHero = (serializedPathHero: SerializedPath['hero']) =>
  serializedPathHero || null

const parseSerializedPathNotes = (
  serializedPathNotes: SerializedPath['notes'],
) => serializedPathNotes || null

const parseSerializedPathMain = (
  serializedPathMain: SerializedPath['main'],
) => {
  if (!serializedPathMain) return null

  return serializedPathMain.map((resourceId) => {
    const resource = resources[resourceId]

    /* if (!resource)
            throw new Error(
              `${pathName} path error: resource not found error[ ${resourceId} ]`,
            ) */

    return resource
  })
}

const parseSerializedPathExtras = (
  serializedPathExtras: SerializedPath['extras'],
) => serializedPathExtras || []

// TODO remove
const parseSerializedPathExtra = (
  serializedPathExtra: SerializedPath['extra'],
) =>
  (serializedPathExtra || []).map((extra) => {
    if (isSerializedSubPath(extra)) {
      return {
        ...extra,
        main: (extra.main || []).map((extraResourceId) => {
          const extraResource = resources[extraResourceId]

          /* if (!extraResource)
                  throw new Error(
                    `${pathName} path error: '${extra.title}' resource not found error[ ${extraResourceId} ]`,
                  ) */

          return extraResource
        }),
        extra: (extra.extra || [])
          .map((extraResourceId) => {
            const extraResource = resources[extraResourceId]

            /* if (!extraResource)
                    throw new Error(
                      `${pathName} path error: '${extra.title}' resource not found error[ ${extraResourceId} ]`,
                    ) */

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
      }
    }

    // if (isSerializedSubTopic(extra)) {
    return {
      ...extra,
      resources: extra.resources
        .map((extraResourceId) => {
          const extraResource = resources[extraResourceId]

          /* if (!extraResource)
                    throw new Error(
                      `${pathName} path error: '${extra.title}' resource not found error[ ${extraResourceId} ]`,
                    ) */

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
    }
    // }

    /* throw new Error(
            `${pathName} path error: '${
              extra.title
            }' uknown type error[ ${JSON.stringify(extra, null, 4)} ]`,
          ) */
  })

export const parseSerializedPath = (serializedPath: SerializedPath): Path => ({
  ...serializedPath,
  logo: parseSerializedPathLogo(serializedPath.logo),
  hero: parseSerializedPathHero(serializedPath.hero),
  notes: parseSerializedPathNotes(serializedPath.notes),
  resources: parseSerializedPathResources(serializedPath.resources),
  // populating resources data
  main: parseSerializedPathMain(serializedPath.main),
  // TODO: remove
  extra: parseSerializedPathExtra(serializedPath.extra),
  //
  extras: (serializedPath.extras || []).map((extra) => {
    return getPath(extra)
  }),
  // populating next paths, those are optional
  next: (() => {
    if (!serializedPath.next) return null
    return getPathsList(serializedPath.next)
  })(),
  // populating prev paths, those are optional
  prev: (() => {
    if (!serializedPath.prev) return null
    return getPathsList(serializedPath.prev)
  })(),
})

export const getSerializedPath = (pathName: string) => {
  const pathFilepath = path.join(process.cwd(), `data/paths/${pathName}.json`)
  const pathData = JSON.parse(fs.readFileSync(pathFilepath, 'utf-8'))

  if (!validateSerializedPath(pathData)) {
    throw new Error(
      `${pathName} path error: schema error[ ${JSON.stringify(
        pathName,
        null,
        4,
      )} ]:
				${JSON.stringify(validateSerializedPath.errors, null, 4)}`,
    )
  }

  return pathData as SerializedPath
}

export const getPath = (pathName: string) => {
  return parseSerializedPath(getSerializedPath(pathName))
}

export const getPathsList = (pathNames: Array<string>) =>
  pathNames.reduce((pathsList, pathName) => {
    const serializedPath = getSerializedPath(pathName)

    pathsList[pathName] = { title: serializedPath.title }

    return pathsList
  }, {} as PathsList)

export const hasExtraResources = <T extends Path>(path: T) => {
  return Boolean(path.extra.length)
}

export const hasSubPathExtraResources = <T extends SubPath>(subpath: T) => {
  return Boolean(subpath.extra.length)
}

export const isSubTopic = (
  pathExtra: SubPath | SubTopic,
): pathExtra is SubTopic => {
  return 'resources' in pathExtra
}

export const isSubPath = (
  pathExtra: SubPath | SubTopic,
): pathExtra is SubPath => {
  return 'main' in pathExtra
}
