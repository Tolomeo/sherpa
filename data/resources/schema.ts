import Ajv, { JSONSchemaType } from 'ajv'
import { SerializedResource } from './types'

const ajv = new Ajv()

export const serializedResourceSchema: JSONSchemaType<SerializedResource> = {
  type: 'object',
  properties: {
    url: { type: 'string', pattern: '^https?://' },
    title: { type: 'string', minLength: 2 },
    source: { type: 'string', minLength: 2, nullable: true },
    //TODO: enum and not nullable
    type: { type: 'string', nullable: true },
  },
  required: ['url', 'title'],
  additionalProperties: false,
}

export const validateSerializedResource = ajv.compile(serializedResourceSchema)
