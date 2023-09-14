import fs from 'fs'
import path from 'path'
import { getResources } from '../resources/data'
import resources, { Resources } from '../resources'
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

//TODO: REMOVE
export const isSerializedSubTopic = (
  pathExtra: SerializedSubPath | SerializedSubTopic,
): pathExtra is SerializedSubPath => {
  return 'resources' in pathExtra
}

//TODO: REMOVE
export const isSerializedSubPath = (
  pathExtra: SerializedSubPath | SerializedSubTopic,
): pathExtra is SerializedSubPath => {
  return 'main' in pathExtra
}

const parseSerializedPathLogo = (serializedPathLogo: SerializedPath['logo']) =>
  serializedPathLogo || null

const parseSerializedPathHero = (serializedPathHero: SerializedPath['hero']) =>
  serializedPathHero || null

const parseSerializedPathNotes = (
  serializedPathNotes: SerializedPath['notes'],
) => serializedPathNotes || null

export const parseSerializedPath = (serializedPath: SerializedPath): Path => ({
  ...serializedPath,
  logo: serializedPath.logo || null,
  hero: serializedPath.hero || null,
  notes: serializedPath.notes || null,
  resources: (() => {
    if (!serializedPath.resources) return null

    return serializedPath.resources.map((resourceId) => {
      const resource = resources[resourceId]

      /* if (!resource)
        throw new Error(
          `${pathName} path error: resource not found error[ ${resourceId} ]`,
        ) */

      return resource
    })
  })(),
  // populating resources data
  main: (() => {
    if (!serializedPath.main) return null

    return serializedPath.main.map((resourceId) => {
      const resource = resources[resourceId]

      /* if (!resource)
        throw new Error(
          `${pathName} path error: resource not found error[ ${resourceId} ]`,
        ) */

      return resource
    })
  })(),
  //
  children: (() => {
    if (!serializedPath.children) return null

    return serializedPath.children.map((childPath) => getPath(childPath))
  })(),
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
