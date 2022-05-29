import Ajv, { JSONSchemaType } from 'ajv'
import resources from '../resources'
import { SerializedPaths, SerializedPath, Paths, Path } from './types'

const ajv = new Ajv()

const serializedPathSchema: JSONSchemaType<SerializedPath> = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    resources: { type: 'array', items: { type: 'string' } },
    next: { type: 'array', items: { type: 'string' }, nullable: true },
    prev: { type: 'array', items: { type: 'string' }, nullable: true },
    extras: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          resources: { type: 'array', items: { type: 'string' } },
        },
        required: ['title', 'resources'],
      },
      nullable: true,
    },
  },
  required: ['title', 'resources'],
  additionalProperties: false,
}

const validateSerializedPath = ajv.compile(serializedPathSchema)

export const parsePaths = <T extends SerializedPaths<string>>(
  serializedPaths: T,
) =>
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
        resources: serializedPath.resources.map((resourceId) => {
          const resource = resources[resourceId]

          if (!resource)
            throw new Error(
              `deserializePathError: resource "${resourceId}" not found`,
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
                  `deserializePathError: extra resource "${extraResourceId}" not found`,
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
          if (serializedPaths[nextPathId])
            nextPaths[nextPathId] = serializedPaths[nextPathId]

          return nextPaths
        }, {} as SerializedPaths<keyof T>),
        // populating prev paths, those are optional
        prev: (serializedPath.prev || []).reduce((prevPaths, prevPathId) => {
          if (serializedPaths[prevPathId])
            prevPaths[prevPathId] = serializedPaths[prevPathId]

          return prevPaths
        }, {} as SerializedPaths<keyof T>),
      }

      return paths
    },
    {} as Paths<keyof T>,
  )

export const hasNextPaths = <T extends Path<string>>(path: T) => {
  return Boolean(Object.keys(path.next).length)
}

export const hasPrevPaths = <T extends Path<string>>(path: T) => {
  return Boolean(Object.keys(path.prev).length)
}

export const hasExtras = <T extends Path<string>>(path: T) => {
  return Boolean(path.extras.length)
}
