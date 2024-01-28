import * as fs from 'node:fs'
import * as path from 'node:path'
import * as url from 'node:url'
import type {
  SerializedResources,
  SerializedResource,
  Resource,
} from '../../src/types'
import { validateSerializedResources } from './validate'

const resourcesDir = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  '../../src/resources',
)

export async function listResources(): Promise<string[]> {
  try {
    let files = await fs.promises.readdir(resourcesDir)
    files = files.filter((file: string) => file.endsWith('.json'))

    const fileNames = files.map((file: string) => {
      return path.parse(file).name
    })

    return fileNames
  } catch (error) {
    console.error('Error reading resource sources:', error)
    throw error // Re-throw the error to handle it properly in the calling code
  }
}

const parseSerializedResource = (serializedResource: SerializedResource) => {
  const parsedResource = { ...serializedResource } as Resource

  if (!parsedResource.source) {
    const resourceUrl = new URL(parsedResource.url)

    switch (resourceUrl.hostname) {
      case 'github.com':
        parsedResource.source = `${resourceUrl.hostname}/${
          resourceUrl.pathname.split('/').filter(Boolean)[0]
        }`
        break
      default:
        parsedResource.source = resourceUrl.hostname.replace(/^www./, '')
    }
  }

  return parsedResource
}

const parseSerializedResources = (serializedResources: SerializedResources) => {
  const uniqueResources: Record<SerializedResource['url'], true | undefined> =
    {}

  return serializedResources.map((serializedResource) => {
    if (uniqueResources[serializedResource.url]) {
      throw new Error(
        `SerializedResource duplication error[ ${serializedResource.url} ]:
				1: ${JSON.stringify(uniqueResources[serializedResource.url], null, 4)}
				2: ${JSON.stringify(serializedResource, null, 4)}`,
      )
    }

    uniqueResources[serializedResource.url] = true

    return parseSerializedResource(serializedResource)
  })
}

export const readSerializedResources = (topicName: string) => {
  const resourcesFile = path.join(resourcesDir, `${topicName}.json`)

  try {
    const serializedResources = JSON.parse(
      fs.readFileSync(resourcesFile, {
        encoding: 'utf8',
      }),
    ) as SerializedResources

    const resourcesDataSchemaErrors =
      validateSerializedResources(serializedResources)

    if (resourcesDataSchemaErrors) {
      throw new Error(
        `Serialized resources schema error[ ${JSON.stringify(
          resourcesDataSchemaErrors,
          null,
          2,
        )} ]`,
      )
    }

    return serializedResources
  } catch (err) {
    console.error(`Error reading ${topicName} resources`)
    throw err
  }
}

export const readResources = (topicName: string) => {
  return parseSerializedResources(readSerializedResources(topicName))
}
