import Ajv, { JSONSchemaType } from 'ajv'
import { SerializedResource, ResourceType } from './types'

const ajv = new Ajv()

export const serializedResourceSchema: JSONSchemaType<SerializedResource> = {
  type: 'object',
  properties: {
    url: { type: 'string', pattern: '^https?://' },
    title: { type: 'string', minLength: 2 },
    source: { type: 'string', minLength: 2, nullable: true },
    type: { type: 'string', enum: Object.values(ResourceType) },
  },
  required: ['url', 'title', 'type'],
  additionalProperties: false,
}

export const validateSerializedResource = ajv.compile(serializedResourceSchema)
