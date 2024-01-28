import * as fs from 'node:fs'
import * as path from 'node:path'
import * as url from 'node:url'
import type { SerializedPath, Path, PathTopic } from '../../src/types'
import { validatePathTopic, validateSerializedPath } from './validate'

const pathsDir = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  '../../src/paths',
)

export async function listPaths(): Promise<string[]> {
  try {
    let files = await fs.promises.readdir(pathsDir)
    files = files.filter((file: string) => file.endsWith('.json'))

    const fileNames = files.map((file: string) => {
      return path.parse(file).name
    })

    return fileNames
  } catch (error) {
    console.error('Error reading path sources:', error)
    throw error // Re-throw the error to handle it properly in the calling code
  }
}

const parseSerializedPath = (
  topicName: string,
  serializedPath: SerializedPath,
): Path => {
  const topicNameValidationErrors = validatePathTopic(topicName)

  if (topicNameValidationErrors) {
    throw new Error(
      `'${topicName}' name error[ ${JSON.stringify(topicName, null, 2)} ]:
				${JSON.stringify(topicNameValidationErrors, null, 2)}`,
    )
  }

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
  const pathFile = path.join(pathsDir, `${pathName}.json`)

  try {
    const serializedPath = JSON.parse(
      fs.readFileSync(pathFile, { encoding: 'utf8' }),
    ) as SerializedPath
    return serializedPath
  } catch (err) {
    console.error(`Error reading ${pathFile}`)
    throw err
  }
}

export const readPath = (topicName: string) => {
  return parseSerializedPath(topicName, readSerializedPath(topicName))
}

export const readPaths = (topicNames: string[]) =>
  topicNames.map((topicName) => readPath(topicName))
