import Ajv, { JSONSchemaType } from 'ajv'
import ajvErrors from 'ajv-errors'
import { SerializedPath } from './types'

const ajv = new Ajv({ allErrors: true })
ajvErrors(ajv)

const serializedPathSchema: JSONSchemaType<SerializedPath> = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 2 },
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
  required: ['title'],
  additionalProperties: false,
}

const validateSerializedPathSchema = (data: SerializedPath) => {
  ajv.validate(serializedPathSchema, data)

  return ajv.errors ? ajv.errors : null
}

const validateSeralizedPathSchemaResources = (data: SerializedPath) => {
  if (!data.main || !data.resources) return null

  ajv.validate(
    {
      type: 'object',
      properties: {
        main: {
          type: 'array',
          items: {
            not: {
              type: 'string',
              enum: data.resources,
            },
          },
        },
      },
      nullable: true,
      errorMessage:
        "urls contained in 'main' shouldn't be found duplicated in 'resources'",
    },
    data,
  )

  return ajv.errors ? ajv.errors : null
}

export const validateSerializedPath = function (data: SerializedPath) {
  for (let validator of [
    validateSerializedPathSchema,
    validateSeralizedPathSchemaResources,
  ]) {
    const errors = validator(data)

    if (errors) return errors
  }

  return null
}
