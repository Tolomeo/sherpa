import Ajv, { JSONSchemaType } from 'ajv'
import {
  SerializedResources,
  SerializedResource,
  Resources,
  resourceType,
} from './types'

const ajv = new Ajv()

const serializedResourceSchema: JSONSchemaType<SerializedResource> = {
  type: 'object',
  properties: {
    url: { type: 'string' },
    type: {
      type: 'array',
      items: {
        type: 'string',
        enum: resourceType,
      },
    },
    title: { type: 'string' },
    source: { type: 'string', nullable: true },
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

    resourcesMap[serializedResource.url] = {
      ...serializedResource,
      source:
        serializedResource.source ||
        new URL(serializedResource.url).hostname.replace(/^www./, ''),
    }

    return resourcesMap
  }, {} as Resources)
