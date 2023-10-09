import fs from 'fs'
import path from 'path'
import { SerializedPath, Paths, Path, PathTopic } from './types'
import { validateSerializedPath } from './schema'

const parseSerializedPath = (
  topicName: string,
  serializedPath: SerializedPath,
): Path => {
  const dataValidationErrors = validateSerializedPath(serializedPath)

  if (dataValidationErrors) {
    throw new Error(
      `'${topicName}' serialized data schema error[ ${JSON.stringify(
        topicName,
        null,
        2,
      )} ]:
				${JSON.stringify(dataValidationErrors, null, 2)}`,
    )
  }

  const { logo, hero, notes, resources, main, children, prev, next } =
    serializedPath

  return {
    topic: topicName as PathTopic,
    logo: logo || null,
    hero: hero || null,
    notes: notes || null,
    resources: resources || null,
    main: main || null,
    children: (() => {
      if (!children) return null

      return children.map((childPath) => readPath(childPath))
    })(),
    next: next || null,
    prev: prev || null,
  }
}

export const readSerializedPath = (pathName: string) => {
  const filepath = path.join(process.cwd(), `data/paths/json/${pathName}.json`)
  const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'))

  return data as SerializedPath
}

export const readPath = (topicName: string) => {
  return parseSerializedPath(topicName, readSerializedPath(topicName))
}

export const readPaths = (topicNames: string[]) =>
  topicNames.map((topicName) => readPath(topicName))

export const readPathsList = (topicNames: Array<string>) =>
  topicNames.reduce((pathsList, topicName) => {
    pathsList[topicName] = { topic: topicName }

    return pathsList
  }, {} as Paths)
