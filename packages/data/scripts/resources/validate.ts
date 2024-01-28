import Ajv from 'ajv'
import type { JSONSchemaType } from 'ajv'
import ajvErrors from 'ajv-errors'
import { ResourceType } from '../../src/types'
import type { SerializedResource } from '../../src/types'

const ajv = ajvErrors(new Ajv({ allErrors: true }))

const serializedResourcesSchema: JSONSchemaType<SerializedResource[]> = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      url: { type: 'string', pattern: '^https?://' },
      title: { type: 'string', minLength: 2 },
      source: { type: 'string', minLength: 2, nullable: true },
      type: { type: 'string', enum: Object.values(ResourceType) },
    },
    required: ['url', 'title', 'type'],
    additionalProperties: false,
    // if the url is from youtube, source must indicate the youtube channel
    if: {
      properties: {
        url: {
          type: 'string',
          // the youtube url is not the url of a channel itself
          pattern: '^https?://www.youtube.com/(?!@|c/)',
        },
      },
    },
    then: {
      required: ['url', 'title', 'type', 'source'],
    },
    else: {
      required: ['url', 'title', 'type'],
    },
  },
}

export const validateSerializedResources = (
  resources: SerializedResource[],
) => {
  ajv.validate(serializedResourcesSchema, resources)

  return ajv.errors ? ajv.errors : null
}
