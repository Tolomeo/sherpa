import fs from 'fs'
import path from 'path'
import { SerializedPath, Paths, Path } from './types'
import { validateSerializedPath } from './schema'

const parseSerializedPath = (
  topicName: string,
  {
    title,
    logo,
    hero,
    notes,
    resources,
    main,
    children,
    prev,
    next,
  }: SerializedPath,
): Path => ({
  topic: topicName,
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

    return readPathsList(next)
  })(),
  prev: (() => {
    if (!prev) return null

    return readPathsList(prev)
  })(),
})

export const readSerializedPath = (pathName: string) => {
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

export const readPath = (topicName: string) => {
  return parseSerializedPath(topicName, readSerializedPath(topicName))
}

export const readPaths = (topicNames: string[]) =>
  topicNames.map((topicName) => readPath(topicName))

export const readPathsList = (topicNames: Array<string>) =>
  topicNames.reduce((pathsList, topicName) => {
    const serializedPath = readSerializedPath(topicName)

    pathsList[topicName] = { topic: topicName, title: serializedPath.title }

    return pathsList
  }, {} as Paths)
