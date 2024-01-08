import Ajv from 'ajv'
import type { JSONSchemaType } from 'ajv'
import ajvErrors from 'ajv-errors'
import { PathTopic } from './types'
import type { SerializedPath } from './types'

const ajv = new Ajv({ allErrors: true })
ajvErrors(ajv)

const serializedPathSchema: JSONSchemaType<SerializedPath> = {
  type: 'object',
  properties: {
    logo: {
      type: 'string',
      pattern: '^<svg.+/svg>$',
      contentMediaType: 'image/svg+xml',
      nullable: true,
    },
    hero: {
      type: 'object',
      properties: {
        foreground: {
          type: 'string',
          pattern: '^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$',
        },
        background: {
          type: 'array',
          items: {
            type: 'string',
            pattern: '^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$',
          },
          minItems: 2,
        },
      },
      nullable: true,
      required: ['foreground', 'background'],
      additionalProperties: false,
    },
    notes: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 3,
      },
      minItems: 1,
      nullable: true,
      uniqueItems: true,
    },
    resources: {
      type: 'array',
      items: { type: 'string', pattern: '^https?://' },
      minItems: 1,
      uniqueItems: true,
      nullable: true,
    },
    main: {
      type: 'array',
      items: { type: 'string', pattern: '^https?://' },
      minItems: 2,
      nullable: true,
      uniqueItems: true,
    },
    next: {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
      nullable: true,
      uniqueItems: true,
    },
    prev: {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
      nullable: true,
      uniqueItems: true,
    },
    children: {
      type: 'array',
      items: {
        type: 'string',
      },
      minItems: 1,
      uniqueItems: true,
      nullable: true,
    },
  },
  required: [],
  additionalProperties: false,
}

export const validatePathTopic = (topic: string) => {
  ajv.validate(
    {
      type: 'string',
      enum: Object.values(PathTopic),
    },
    topic,
  )

  return ajv.errors ? ajv.errors : null
}

export const validateSerializedPath = (data: SerializedPath) => {
  ajv.validate(serializedPathSchema, data)

  return ajv.errors ? ajv.errors : null
}
