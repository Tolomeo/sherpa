import Ajv, { JSONSchemaType } from 'ajv'
import resources from '../resources'
import { SerializedPaths, SerializedPath, Paths, Path } from './types'

const ajv = new Ajv()

const serializedPathSchema: JSONSchemaType<SerializedPath> = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 2 },
    core: {
      type: 'array',
      items: { type: 'string', pattern: '^https?://' },
      minItems: 1,
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
    extras: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 2 },
          resources: {
            type: 'array',
            items: { type: 'string', pattern: '^https?://' },
            minItems: 1,
            uniqueItems: true,
          },
        },
        required: ['title', 'resources'],
      },
      minItems: 1,
      nullable: true,
    },
  },
  required: ['title', 'core'],
  additionalProperties: false,
}

const validateSerializedPath = ajv.compile(serializedPathSchema)

export const parsePaths = <T extends SerializedPaths>(serializedPaths: T) =>
  Object.entries(serializedPaths).reduce(
    (paths, [pathName, serializedPath]) => {
      if (!validateSerializedPath(serializedPath)) {
        throw new Error(
          `SerializedPath schema error[${JSON.stringify(
            serializedPath,
            null,
            4,
          )}]:
				${JSON.stringify(validateSerializedPath.errors, null, 4)}`,
        )
      }

      paths[pathName] = {
        ...serializedPath,
        // populating resources data
        core: serializedPath.core.map((resourceId) => {
          const resource = resources[resourceId]

          if (!resource)
            throw new Error(
              `SerializedPath resource not found error[${resourceId}]`,
            )

          return resource
        }),
        // populating extra resources, those are optional
        extras: (serializedPath.extras || []).map((extra) => ({
          ...extra,
          resources: extra.resources
            .map((extraResourceId) => {
              const extraResource = resources[extraResourceId]

              if (!extraResource)
                throw new Error(
                  `Serializedpath '${extra.title}' resource not found error[${extraResourceId}]`,
                )

              return extraResource
            })
            // sorting alphabetically by resource title
            .sort((resourceA, resourceB) => {
              const titleA = resourceA.title.toUpperCase()
              const titleB = resourceB.title.toUpperCase()

              if (titleA > titleB) return 1
              else if (titleA < titleB) return -1

              return 0
            }),
        })),
        // populating next paths, those are optional
        next: (serializedPath.next || []).reduce((nextPaths, nextPathId) => {
          const nextPath = serializedPaths[nextPathId]

          if (!nextPath)
            throw new Error(
              `Serializedpath next path not found error[${nextPathId}]`,
            )

          nextPaths[nextPathId] = nextPath

          return nextPaths
        }, {} as SerializedPaths<keyof T>),
        // populating prev paths, those are optional
        prev: (serializedPath.prev || []).reduce((prevPaths, prevPathId) => {
          const prevPath = serializedPaths[prevPathId]

          if (!prevPath)
            throw new Error(
              `Serializedpath prev path not found error[${prevPathId}]`,
            )

          prevPaths[prevPathId] = prevPath

          return prevPaths
        }, {} as SerializedPaths<keyof T>),
      }

      return paths
    },
    {} as Paths<keyof T>,
  )

export const hasNextPaths = <T extends Path>(path: T) => {
  return Boolean(Object.keys(path.next).length)
}

export const hasPrevPaths = <T extends Path>(path: T) => {
  return Boolean(Object.keys(path.prev).length)
}

export const hasExtras = <T extends Path>(path: T) => {
  return Boolean(path.extras.length)
}
