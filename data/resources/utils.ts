import Ajv, { JSONSchemaType } from 'ajv'
import {
  SerializedResources,
  SerializedResource,
  Resources,
  Resource,
} from './types'

const ajv = new Ajv()

const serializedResourceSchema: JSONSchemaType<SerializedResource> = {
  type: 'object',
  properties: {
    url: { type: 'string', pattern: '^https?://' },
    title: { type: 'string', minLength: 2 },
    source: { type: 'string', minLength: 2, nullable: true },
  },
  required: ['url', 'title'],
  additionalProperties: false,
}

export const validateSerializedResource = ajv.compile(serializedResourceSchema)

const parseResource = (serializedResource: SerializedResource) => {
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

export const parseResources = (serializedResources: SerializedResources) =>
  serializedResources.reduce((resourcesMap, serializedResource) => {
    if (!validateSerializedResource(serializedResource)) {
      throw new Error(
        `SerializedResource schema error[${JSON.stringify(
          serializedResource,
          null,
          4,
        )}]:
				${JSON.stringify(validateSerializedResource.errors, null, 4)}`,
      )
    }

    if (resourcesMap[serializedResource.url]) {
      throw new Error(
        `SerializedResource duplication error[${serializedResource.url}]:
				1: ${JSON.stringify(resourcesMap[serializedResource.url], null, 4)}
				2: ${JSON.stringify(serializedResource, null, 4)}`,
      )
    }

    resourcesMap[serializedResource.url] = parseResource(serializedResource)

    return resourcesMap
  }, {} as Resources)
