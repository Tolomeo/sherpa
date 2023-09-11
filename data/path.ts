import fs from 'fs'
import path from 'path'
import Ajv, { JSONSchemaType } from 'ajv'
import resources, { Resource } from './resources'
import {
  SerializedSubPath,
  SerializedSubTopic,
  SerializedPaths,
  SerializedPath,
  Paths,
  Path,
  SubPath,
  SubTopic,
} from './paths/types'
import uidesign from './paths/uidesign.json'
import htmlcss from './paths/htmlcss.json'
import webaccessibility from './paths/webaccessibility.json'
import javascript from './paths/javascript.json'
import npm from './paths/npm.json'
import typescript from './paths/typescript.json'
import react from './paths/react.json'
import next from './paths/next.json'
import node from './paths/node.json'
import commandline from './paths/commandline.json'
import docker from './paths/docker.json'
import git from './paths/git.json'
import python from './paths/python.json'
import regex from './paths/regex.json'
import neovim from './paths/neovim.json'
import lua from './paths/lua.json'

const serializedPaths = {
  uidesign,
  htmlcss,
  webaccessibility,
  javascript,
  typescript,
  react,
  next,
  npm,
  node,
  commandline,
  docker,
  git,
  python,
  regex,
  neovim,
  lua,
}

const ajv = new Ajv()

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
    extras: {
      type: 'array',
      items: {
        type: 'string',
      },
      minItems: 1,
      uniqueItems: true,
      nullable: true,
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
  required: ['title'],
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

const parseSerializedPathResources = (
  serializedPathResources?: SerializedPath['resources'],
) =>
  Object.values(
    (serializedPathResources || []).reduce((pathResources, resourceId) => {
      const resource = resources[resourceId]

      /* if (!resource)
        throw new Error(
          `${pathName} path error: resource not found error[ ${resourceId} ]`,
        ) */

      const { type } = resource

      // TODO remove this
      if (!type) return pathResources

      const resourceTypeToTopicTitle: Record<
        NonNullable<Resource['type']>,
        SubTopic['title']
      > = {
        // TODO: move to separate module
        basics: "There's more",
        advanced: 'Beyond basics',
        'how-to': 'How do they do it',
        curiosity: 'Nice to know',
        tool: 'Work smarter, not harder',
        reference: 'Great bookmarks',
        feed: 'Stay in the loop',
      }

      const topicTitle = resourceTypeToTopicTitle[type]

      if (!pathResources[topicTitle]) {
        pathResources[topicTitle] = {
          title: topicTitle,
          resources: [],
        }
      }

      pathResources[topicTitle].resources.push(resource)

      return pathResources
    }, {} as Record<SubTopic['title'], SubTopic>),
  )

const sortPathResources = (pathResources: Path['resources']) =>
  pathResources
    //TODO: refactor this
    .sort((pathTopicA, pathTopicB) => {
      // TODO: move to separate module
      const topicsOrder: Array<SubTopic['title']> = [
        "There's more",
        'Beyond basics',
        'How do they do it',
        'Nice to know',
        'Work smarter, not harder',
        'Great bookmarks',
        'Stay in the loop',
      ]

      return (
        topicsOrder.findIndex(
          (orderedTopicTitle) => orderedTopicTitle === pathTopicA.title,
        ) -
        topicsOrder.findIndex(
          (orderedTopicTitle) => orderedTopicTitle === pathTopicB.title,
        )
      )
    })
    .map((pathTopic) => {
      pathTopic.resources.sort((resourceA, resourceB) => {
        const titleA = resourceA.title.toUpperCase()
        const titleB = resourceB.title.toUpperCase()

        if (titleA > titleB) return 1
        else if (titleA < titleB) return -1

        return 0
      })

      return pathTopic
    })

const parseSerializedPathLogo = (serializedPathLogo: SerializedPath['logo']) =>
  serializedPathLogo || null

const parseSerializedPathHero = (serializedPathHero: SerializedPath['hero']) =>
  serializedPathHero || null

const parseSerializedPathNotes = (
  serializedPathNotes: SerializedPath['notes'],
) => serializedPathNotes || []

const parseSerializedPathMain = (serializedPathMain: SerializedPath['main']) =>
  (serializedPathMain || []).map((resourceId) => {
    const resource = resources[resourceId]

    /* if (!resource)
            throw new Error(
              `${pathName} path error: resource not found error[ ${resourceId} ]`,
            ) */

    return resource
  })

const parseSerializedPathExtras = (
  serializedPathExtras: SerializedPath['extras'],
) => serializedPathExtras || []

// TODO remove
const parseSerializedPathExtra = (
  serializedPathExtra: SerializedPath['extra'],
) =>
  (serializedPathExtra || []).map((extra) => {
    if (isSerializedSubPath(extra)) {
      return {
        ...extra,
        main: (extra.main || []).map((extraResourceId) => {
          const extraResource = resources[extraResourceId]

          /* if (!extraResource)
                  throw new Error(
                    `${pathName} path error: '${extra.title}' resource not found error[ ${extraResourceId} ]`,
                  ) */

          return extraResource
        }),
        extra: (extra.extra || [])
          .map((extraResourceId) => {
            const extraResource = resources[extraResourceId]

            /* if (!extraResource)
                    throw new Error(
                      `${pathName} path error: '${extra.title}' resource not found error[ ${extraResourceId} ]`,
                    ) */

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

    // if (isSerializedSubTopic(extra)) {
    return {
      ...extra,
      resources: extra.resources
        .map((extraResourceId) => {
          const extraResource = resources[extraResourceId]

          /* if (!extraResource)
                    throw new Error(
                      `${pathName} path error: '${extra.title}' resource not found error[ ${extraResourceId} ]`,
                    ) */

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
    // }

    /* throw new Error(
            `${pathName} path error: '${
              extra.title
            }' uknown type error[ ${JSON.stringify(extra, null, 4)} ]`,
          ) */
  })

export const parseSerializedPath = (serializedPath: SerializedPath) => ({
  ...serializedPath,
  logo: parseSerializedPathLogo(serializedPath.logo),
  hero: parseSerializedPathHero(serializedPath.hero),
  notes: parseSerializedPathNotes(serializedPath.notes),
  resources: sortPathResources(
    parseSerializedPathResources(serializedPath.resources),
  ),
  // populating resources data
  main: parseSerializedPathMain(serializedPath.main),
  extras: parseSerializedPathExtras(serializedPath.extras),
  // populating extra resources, those are optional
  extra: parseSerializedPathExtra(serializedPath.extra),
  // populating next paths, those are optional
  next: (serializedPath.next || []).reduce((nextPaths, nextPathId) => {
    const nextPath = serializedPaths[nextPathId as keyof typeof serializedPaths]

    /* if (!nextPath)
		throw new Error(
			`${pathName} path error: next path not found error[ ${nextPathId} ]`,
		) */

    nextPaths[nextPathId] = nextPath

    return nextPaths
  }, {} as SerializedPaths),
  // populating prev paths, those are optional
  prev: (serializedPath.prev || []).reduce((prevPaths, prevPathId) => {
    const prevPath = serializedPaths[prevPathId as keyof typeof serializedPaths]

    /* if (!prevPath)
		throw new Error(
			`${pathName} path error: prev path not found error[ ${prevPathId} ]`,
		) */

    prevPaths[prevPathId] = prevPath

    return prevPaths
  }, {} as SerializedPaths),
})

export const getPath = (pathName: string) => {
  const pathFilepath = path.join(process.cwd(), `data/paths/${pathName}.json`)
  const pathData = JSON.parse(fs.readFileSync(pathFilepath, 'utf-8'))
  return parseSerializedPath(pathData as SerializedPath)
}

export const parsePaths = () =>
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

      paths[pathName] = parseSerializedPath(serializedPath)

      return paths
    },
    {} as Paths,
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

export const hasResources = <T extends Path>(path: T) => {
  return Boolean(path.resources.length)
}

export const hasNotes = <T extends Path>(path: T) => {
  return Boolean(path.notes.length)
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
