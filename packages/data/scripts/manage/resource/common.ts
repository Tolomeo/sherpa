import type Resource from '../../../src/resource'
import { getAllByUrl } from '../../../src/resource'
import {
  ResourceDataSchema,
  type ResourceData,
  type HealthcheckStrategy,
} from '../../../types'
import { format, log, command } from '../../common'
import { chooseHealthCheckStrategy, scrapeResourceData } from '../healthcheck'

type WithResourceTypeVariant<T> = T extends { name: infer N; variant: infer V }
  ? `${Extract<N, string>}.${Extract<V, string>}`
  : never

type WithoutResourceTypeVariant<T> = T extends {
  name: infer N
  variant?: never
}
  ? Extract<N, string>
  : never

export type ResourceTypeName =
  | WithResourceTypeVariant<ResourceData['type']>
  | WithoutResourceTypeVariant<ResourceData['type']>

const typeToTypeName = (type: ResourceData['type']) => {
  let typeName: ResourceTypeName

  switch (type.name) {
    case 'knowledge':
      typeName = `${type.name}.${type.variant}`
      break
    case 'reference':
      typeName = `${type.name}.${type.variant}`
      break
    default:
      typeName = type.name
  }

  return typeName
}

const typeNameToType = (typeName: ResourceTypeName): ResourceData['type'] => {
  switch (typeName) {
    case 'knowledge.basics':
      return {
        name: 'knowledge',
        variant: 'basics',
      }
    case 'knowledge.advanced':
      return {
        name: 'knowledge',
        variant: 'advanced',
      }
    case 'knowledge.how-to':
      return {
        name: 'knowledge',
        variant: 'how-to',
      }
    case 'reference.index':
      return {
        name: 'reference',
        variant: 'index',
      }
    case 'reference.feed':
      return {
        name: 'reference',
        variant: 'feed',
      }
    default:
      return {
        name: typeName,
      }
  }
}

export const findResource = async () => {
  let resource: Resource | undefined

  await command.loop(async (control) => {
    const url = await command.input(
      `Search resource - Enter url fragment to look for`,
    )

    if (!url) return control.end

    const resources = await getAllByUrl(url)

    if (!resources.length) {
      log.warning(`No results found`)
      return control.repeat
    }

    if (resources.length === 1) {
      log.success(`1 result found`)
      resource = resources[0]
      return control.end
    }

    log.success(`${resources.length} results found`)

    const action = await command.choice(
      `Select resource`,
      resources.map((r) => r.url),
    )

    if (!action) control.repeat

    resource = resources.find((r) => r.url === action)

    return control.end
  })

  return resource
}

export const enterResourceType = async (type?: ResourceData['type']) => {
  const typeName = type ? typeToTypeName(type) : undefined
  let updatedType: ResourceData['type'] | undefined

  await command.loop(async (control) => {
    const typeChoice = await command.choice(
      'Type',
      [
        'knowledge.basics',
        'knowledge.advanced',
        'knowledge.how-to',
        'reference.index',
        'reference.feed',
        'tool',
        'curiosity',
      ] as ResourceTypeName[],
      {
        initial: typeName,
      },
    )

    if (!typeChoice) return control.repeat

    updatedType = typeNameToType(typeChoice)

    return control.end
  })

  return updatedType!
}

export const enterResourceData = async (
  url: string,
  data: Partial<ResourceData['data']> = {},
) => {
  const populatedData = { ...data }

  await command.loop(async (control) => {
    log.lead(`Enter data for resource ${url}`)

    const title = await command.input(`Title`, { initial: populatedData.title })

    if (title) populatedData.title = title

    const source = await command.input('Source', {
      initial: populatedData.source,
    })

    if (source) populatedData.source = source

    const validation = ResourceDataSchema.shape.data.safeParse(populatedData)

    if (!validation.success) {
      log.error('Invalid resource data entered')
      log.error(validation.error as unknown as string)
      return control.repeat
    }

    return control.end
  })

  return populatedData as ResourceData['data']
}

export const enterResource = async (url: string) => {
  let resource: ResourceData | undefined
  /* let data: ResourceData['data'] | undefined
  let type: ResourceData['type'] | undefined */
  let healthcheck: HealthcheckStrategy | undefined

  await command.loop(async (control) => {
    log.lead(`Entering ${url} resource`)

    const scrapedData = await scrapeResourceData(url, healthcheck)

    if (!scrapedData) {
      log.warning(`Scraping failed`)

      if (await command.confirm(`Try with a different strategy?`)) {
        healthcheck = await chooseHealthCheckStrategy().then(
          (strategy) => strategy ?? undefined,
        )
        return control.repeat
      }

      return control.end
    }

    const enteredData = await enterResourceData(url, scrapedData)
    const enteredType = await enterResourceType(resource?.type)

    log.text(
      format.diff(
        { url, ...resource },
        { url, data: enteredData, type: enteredType, healthcheck },
      ),
    )

    const action = await command.choice(`Data for ${url}`, [
      'Confirm data',
      'Change data',
    ])

    switch (action) {
      case 'Confirm data':
        resource = {
          url,
          data: enteredData,
          type: enteredType,
          healthcheck,
        }
        return control.end
      case 'Change data':
        resource = {
          url,
          data: enteredData,
          type: enteredType,
          healthcheck,
        }
        return control.repeat
      case null:
        return control.end
    }
  })

  if (!resource) return

  return resource

  /* try {
    const resource = await createResource(data)
    log.success(`Resource ${resource.id} successfully created`)
    return resource
  } catch (err) {
    log.error(`Error importing ${url}`)
    log.error(err as string)
  } */
}
