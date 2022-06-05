import Ajv, { JSONSchemaType } from 'ajv'
import {
  SerializedResources,
  SerializedResource,
  Resources,
  Resource,
  resourceType,
} from './types'

const ajv = new Ajv()

const serializedResourceSchema: JSONSchemaType<SerializedResource> = {
  type: 'object',
  properties: {
    url: { type: 'string', pattern: '^https?://' },
    type: {
      type: 'array',
      items: {
        type: 'string',
        enum: resourceType,
      },
      minItems: 1,
    },
    title: { type: 'string', minLength: 2 },
    source: { type: 'string', minLength: 2, nullable: true },
  },
  required: ['url', 'type', 'title'],
  additionalProperties: false,
}

export const validateSerializedResource = ajv.compile(serializedResourceSchema)

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

    if (serializedResource.source) {
      resourcesMap[serializedResource.url] = serializedResource as Resource
      return resourcesMap
    }

    const resourceUrl = new URL(serializedResource.url)

    switch (resourceUrl.hostname) {
      case 'github.com':
        resourcesMap[serializedResource.url] = {
          ...serializedResource,
          source: `${resourceUrl.hostname}/${
            resourceUrl.pathname.split('/').filter(Boolean)[0]
          }`,
        }
        break
      default:
        resourcesMap[serializedResource.url] = {
          ...serializedResource,
          source: resourceUrl.hostname.replace(/^www./, ''),
        }
    }

    return resourcesMap
  }, {} as Resources)
