import Ajv, { JSONSchemaType } from 'ajv'
import resources from '../resources'
import {
  SerializedSubPath,
  SerializedSubTopic,
  SerializedPaths,
  SerializedPath,
  Paths,
  Path,
  SubPath,
  SubTopic,
} from './types'

const ajv = new Ajv()

const serializedPathSchema: JSONSchemaType<SerializedPath> = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 2 },
    brand: {
      type: 'object',
      properties: {
        logoSvg: {
          type: 'string',
          // TODO: SVG pattern
        },
        textColor: {
          type: 'string',
          // TODO: HEX pattern
        },
        backgroundGradient: {
          type: 'array',
          items: {
            type: 'string',
            // TODO: HEX pattern
          },
          minItems: 2,
          maxItems: 2,
        },
      },
      nullable: true,
      required: ['logoSvg', 'textColor', 'backgroundGradient'],
    },
    main: {
      type: 'array',
      items: { type: 'string', pattern: '^https?://' },
      minItems: 2,
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
    extra: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'object',
            properties: {
              title: { type: 'string', minLength: 2 },
              main: {
                type: 'array',
                items: { type: 'string', pattern: '^https?://' },
                minItems: 2,
                uniqueItems: true,
              },
              extra: {
                type: 'array',
                items: { type: 'string', pattern: '^https?://' },
                minItems: 1,
                uniqueItems: true,
                nullable: true,
              },
            },
            required: ['title', 'main'],
          },
          {
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
        ],
      },
      minItems: 1,
      nullable: true,
    },
  },
  required: ['title', 'main'],
  additionalProperties: false,
}

const validateSerializedPath = ajv.compile(serializedPathSchema)

export const isSerializedSubTopic = (
  pathExtra: SerializedSubPath | SerializedSubTopic,
): pathExtra is SerializedSubPath => {
  return 'resources' in pathExtra
}

export const isSerializedSubPath = (
  pathExtra: SerializedSubPath | SerializedSubTopic,
): pathExtra is SerializedSubPath => {
  return 'main' in pathExtra
}

export const parsePaths = <T extends SerializedPaths>(serializedPaths: T) =>
  Object.entries(serializedPaths).reduce(
    (paths, [pathName, serializedPath]) => {
      if (!validateSerializedPath(serializedPath)) {
        throw new Error(
          `${pathName} path error: schema error[ ${JSON.stringify(
            serializedPath,
            null,
            4,
          )} ]:
				${JSON.stringify(validateSerializedPath.errors, null, 4)}`,
        )
      }

      paths[pathName] = {
        ...serializedPath,
        brand: serializedPath.brand || null,
        // populating resources data
        main: serializedPath.main.map((resourceId) => {
          const resource = resources[resourceId]

          if (!resource)
            throw new Error(
              `${pathName} path error: resource not found error[ ${resourceId} ]`,
            )

          return resource
        }),
        // populating extra resources, those are optional
        extra: (serializedPath.extra || []).map((extra) => {
          if (isSerializedSubPath(extra)) {
            return {
              ...extra,
              main: (extra.main || []).map((extraResourceId) => {
                const extraResource = resources[extraResourceId]

                if (!extraResource)
                  throw new Error(
                    `${pathName} path error: '${extra.title}' resource not found error[ ${extraResourceId} ]`,
                  )

                return extraResource
              }),
              extra: (extra.extra || [])
                .map((extraResourceId) => {
                  const extraResource = resources[extraResourceId]

                  if (!extraResource)
                    throw new Error(
                      `${pathName} path error: '${extra.title}' resource not found error[ ${extraResourceId} ]`,
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
            }
          }

          if (isSerializedSubTopic(extra)) {
            return {
              ...extra,
              resources: extra.resources
                .map((extraResourceId) => {
                  const extraResource = resources[extraResourceId]

                  if (!extraResource)
                    throw new Error(
                      `${pathName} path error: '${extra.title}' resource not found error[ ${extraResourceId} ]`,
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
            }
          }

          throw new Error(
            `${pathName} path error: '${
              extra.title
            }' uknown type error[ ${JSON.stringify(extra, null, 4)} ]`,
          )
        }),
        // populating next paths, those are optional
        next: (serializedPath.next || []).reduce((nextPaths, nextPathId) => {
          const nextPath = serializedPaths[nextPathId]

          if (!nextPath)
            throw new Error(
              `${pathName} path error: next path not found error[ ${nextPathId} ]`,
            )

          nextPaths[nextPathId] = nextPath

          return nextPaths
        }, {} as SerializedPaths<keyof T>),
        // populating prev paths, those are optional
        prev: (serializedPath.prev || []).reduce((prevPaths, prevPathId) => {
          const prevPath = serializedPaths[prevPathId]

          if (!prevPath)
            throw new Error(
              `${pathName} path error: prev path not found error[ ${prevPathId} ]`,
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

export const hasExtraResources = <T extends Path>(path: T) => {
  return Boolean(path.extra.length)
}

export const hasSubPathExtraResources = <T extends SubPath>(subpath: T) => {
  return Boolean(subpath.extra.length)
}

export const isSubTopic = (
  pathExtra: SubPath | SubTopic,
): pathExtra is SubTopic => {
  return 'resources' in pathExtra
}

export const isSubPath = (
  pathExtra: SubPath | SubTopic,
): pathExtra is SubPath => {
  return 'main' in pathExtra
}
