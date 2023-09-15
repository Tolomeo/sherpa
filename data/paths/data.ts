import fs from 'fs'
import path from 'path'
import { Resources } from '../resources'
import { SerializedPath, Path, SubPath, SubTopic, PathsList } from './types'
import { validateSerializedPath } from './schema'
import { getResources } from '../resources/data'

export const parseSerializedPath = (
  serializedPath: SerializedPath,
  resources: Resources,
): Path => ({
  ...serializedPath,
  logo: serializedPath.logo || null,
  hero: serializedPath.hero || null,
  notes: serializedPath.notes || null,
  resources: (() => {
    if (!serializedPath.resources) return null

    return serializedPath.resources.map((resourceId) => {
      const resource = resources[resourceId]

      if (!resource)
        throw new Error(`resource not found error [ ${resourceId} ]`)

      return resource
    })
  })(),
  // populating resources data
  main: (() => {
    if (!serializedPath.main) return null

    return serializedPath.main.map((resourceId) => {
      const resource = resources[resourceId]

      if (!resource)
        throw new Error(`resource not found error [ ${resourceId} ]`)

      return resource
    })
  })(),
  //
  children: (() => {
    if (!serializedPath.children) return null

    return serializedPath.children.map((childPath) =>
      getPath(childPath, resources),
    )
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
  const pathDataValidationErrors = validateSerializedPath(pathData)

  if (pathDataValidationErrors) {
    throw new Error(
      `'${pathName}' serialized data schema error[ ${JSON.stringify(
        pathName,
        null,
        2,
      )} ]:
				${JSON.stringify(pathDataValidationErrors, null, 4)}`,
    )
  }

  return pathData as SerializedPath
}

export const getPath = (topicName: string, resources?: Resources) => {
  try {
    const topicResources = resources || getResources(topicName)
    const path = parseSerializedPath(
      getSerializedPath(topicName),
      topicResources,
    )
    return path
  } catch (err) {
    throw new Error(`'${topicName}' topic data read error [ ${err} ]`)
  }
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
