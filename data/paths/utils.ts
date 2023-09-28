import fs from 'fs'
import path from 'path'
import { Resources } from '../resources'
import {
  SerializedPath,
  Path,
  SubPath,
  SubTopic,
  PathsList,
  ParsedPath,
} from './types'
import { validateSerializedPath } from './schema'
import { getResources } from '../resources/utils'

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
  main: (() => {
    if (!serializedPath.main) return null

    return serializedPath.main.map((resourceId) => {
      const resource = resources[resourceId]

      if (!resource)
        throw new Error(`resource not found error [ ${resourceId} ]`)

      return resource
    })
  })(),
  children: (() => {
    if (!serializedPath.children) return null

    return serializedPath.children.map((childPath) =>
      getPath(childPath, resources),
    )
  })(),
  next: (() => {
    if (!serializedPath.next) return null

    return getPathsList(serializedPath.next)
  })(),
  prev: (() => {
    if (!serializedPath.prev) return null

    return getPathsList(serializedPath.prev)
  })(),
})

export const getSerializedPath = (pathName: string) => {
  const filepath = path.join(process.cwd(), `data/paths/json/${pathName}.json`)
  const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
  const dataValidationErrors = validateSerializedPath(data)

  if (dataValidationErrors) {
    throw new Error(
      `'${pathName}' serialized data schema error[ ${JSON.stringify(
        pathName,
        null,
        2,
      )} ]:
				${JSON.stringify(dataValidationErrors, null, 4)}`,
    )
  }

  return data as SerializedPath
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
    throw new Error(`'${topicName}' topic data error [ ${err} ]`)
  }
}

export const getPaths = (topicNames: string[]) =>
  topicNames.map((topicName) => getPath(topicName))

export const getPathsList = (topicNames: Array<string>) =>
  topicNames.reduce((pathsList, pathName) => {
    const serializedPath = getSerializedPath(pathName)

    pathsList[pathName] = { title: serializedPath.title }

    return pathsList
  }, {} as PathsList)

export const parseReadPath = ({
  title,
  logo,
  hero,
  notes,
  resources,
  main,
  children,
  prev,
  next,
}: SerializedPath): ParsedPath => ({
  title,
  logo: logo || null,
  hero: hero || null,
  notes: notes || null,
  resources: resources || null,
  main: main || null,
  children: (() => {
    if (!children) return null

    return children.map((childPath) => readPath(childPath))
  })(),
  next: (() => {
    if (!next) return null

    return getPathsList(next)
  })(),
  prev: (() => {
    if (!prev) return null

    return getPathsList(prev)
  })(),
})

export const readPath = (topicName: string) => {
  return parseReadPath(getSerializedPath(topicName))
}
