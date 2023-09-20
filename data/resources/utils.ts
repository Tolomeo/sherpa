import fs from 'fs'
import path from 'path'
import {
  SerializedResources,
  SerializedResource,
  Resource,
  Resources,
} from './types'
import { validateSerializedResources } from './schema'

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

const parseSerializedResources = (serializedResources: SerializedResources) =>
  serializedResources.reduce((resourcesMap, serializedResource) => {
    if (resourcesMap[serializedResource.url]) {
      throw new Error(
        `SerializedResource duplication error[ ${serializedResource.url} ]:
				1: ${JSON.stringify(resourcesMap[serializedResource.url], null, 4)}
				2: ${JSON.stringify(serializedResource, null, 4)}`,
      )
    }

    resourcesMap[serializedResource.url] =
      parseSerializedResource(serializedResource)

    return resourcesMap
  }, {} as Resources)

export const getSerializedResources = (topicName: string) => {
  const pathFilepath = path.join(
    process.cwd(),
    `data/resources/json/${topicName}.json`,
  )
  const resourcesData = JSON.parse(fs.readFileSync(pathFilepath, 'utf-8'))
  const resourcesDataSchemaErrors = validateSerializedResources(resourcesData)

  if (resourcesDataSchemaErrors) {
    throw new Error(
      `Serialized resources schema error[ ${JSON.stringify(
        resourcesDataSchemaErrors,
        null,
        2,
      )} ]`,
    )
  }

  return resourcesData as SerializedResources
}

export const getResources = (topicName: string) => {
  return parseSerializedResources(getSerializedResources(topicName))
}
