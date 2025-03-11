import { getAllByResourceId } from '../../../src/topic'
import type Resource from '../../../src/resource'
import { getAllByUrl } from '../../../src/resource'
import {
  ResourceDataSchema,
  type ResourceData,
  type ResourceType,
  type HealthcheckStrategy,
} from '../../../types'
import { util, format, log, command } from '../../common'
import { scrapeResourceTitle, chooseHealthCheckStrategy } from '../healthcheck'

export const findResource = async () => {
  let resource: Resource | undefined

  await command.loop(async () => {
    const url = await command.input(
      `Search resource - Enter url fragment to look for`,
    )

    if (!url) return command.loop.END

    const resources = await getAllByUrl(url)

    if (!resources.length) {
      log.warning(`No results found`)
      return command.loop.REPEAT
    }

    if (resources.length === 1) {
      log.success(`1 result found`)
      resource = resources[0]
      return command.loop.END
    }

    log.success(`${resources.length} results found`)

    const action = await command.choice(
      `Select resource`,
      resources.map((r) => r.url),
    )

    if (!action) command.loop.REPEAT

    resource = resources.find((r) => r.url === action)

    return command.loop.END
  })

  return resource
}

export const enterResourceData = async (
  data: Pick<ResourceData, 'url'> & Partial<Omit<ResourceData, 'url'>>,
) => {
  const populatedData = { ...data }

  if (!populatedData.source) {
    const { hostname, pathname } = new URL(populatedData.url)
    const sourceHostname = hostname.replace(/^www./, '')

    populatedData.source =
      sourceHostname === 'github.com'
        ? `${sourceHostname}/${pathname.split('/')[1]}`
        : sourceHostname
  }

  await command.loop(async () => {
    log.lead(`Enter data for url ${populatedData.url}`)

    const url = await command.input(`Url`, { answer: populatedData.url })

    if (url) populatedData.url = url

    const title = await command.input(`Title`, { answer: populatedData.title })

    if (title) populatedData.title = title

    const type = await command.choice(
      'Type',
      [
        'basics',
        'advanced',
        'how-to',
        'curiosity',
        'tool',
        'reference',
        'feed',
      ] as ResourceType[],
      {
        answer: populatedData.type,
      },
    )

    if (type) populatedData.type = type

    const source = await command.input('Source', {
      answer: populatedData.source,
    })

    if (source) populatedData.source = source

    const validation = ResourceDataSchema.safeParse(populatedData)

    if (!validation.success) {
      log.error('Invalid resource data entered')
      log.error(validation.error as unknown as string)
      return command.loop.REPEAT
    }

    return command.loop.END
  })

  return populatedData as ResourceData
}

export const enterResource = async (url: string) => {
  let data: ResourceData | undefined
  let healthcheck: HealthcheckStrategy | undefined

  await command.loop(async () => {
    log.lead(`Entering ${url} resource`)

    const title = await scrapeResourceTitle(url, healthcheck)

    if (!title) {
      log.warning(`Scraping failed`)

      const changeHealthcheck = await command.confirm(
        `Try with a different strategy?`,
      )

      if (changeHealthcheck) {
        const newHealthcheck = await chooseHealthCheckStrategy()
        healthcheck = newHealthcheck ?? undefined
        return command.loop.REPEAT
      }
    }

    const enteredData = await enterResourceData({
      ...data,
      url,
      title,
      healthcheck,
    })

    log.text(format.diff({ url, ...data }, enteredData))

    const action = await command.choice(`Data for ${url}`, [
      'Confirm data',
      'Change data',
    ])

    switch (action) {
      case 'Confirm data':
        data = enteredData
        return command.loop.END
      case 'Change data':
        data = enteredData
        return command.loop.REPEAT
      case null:
        return command.loop.END
    }
  })

  if (!data) return

  return data

  /* try {
    const resource = await createResource(data)
    log.success(`Resource ${resource.id} successfully created`)
    return resource
  } catch (err) {
    log.error(`Error importing ${url}`)
    log.error(err as string)
  } */
}
