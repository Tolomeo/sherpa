import { getAllByResourceId } from '../../src/topic'
import type Resource from '../../src/resource'
import { create, getAllByUrl, getByUrl } from '../../src/resource'
import {
  ResourceDataSchema,
  type ResourceData,
  type ResourceType,
} from '../../types'
import { util, format, log, command } from '../common'
import { scrapeResourceTitle, chooseHealthCheckStrategy } from './healthcheck'

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

export const importResource = async (url: string) => {
  const existingResource = await getByUrl(url)

  if (existingResource) {
    log.warning(`${url} already found among resources`)
    return existingResource
  }

  let data: ResourceData | undefined

  await command.loop(async () => {
    log.lead(`Importing ${url} resource`)

    const action = await command.choice('Choose action', [
      'open',
      'enter data',
      'scrape and enter data',
    ])

    switch (action) {
      case 'open':
        await util.open(url)
        return command.loop.REPEAT

      case 'enter data': {
        const enteredData = await enterResourceData({ ...data, url })

        log.text(format.diff({ url, ...data }, enteredData))

        const confirm = await command.confirm(`Confirm data for ${url}`)

        if (confirm) {
          data = enteredData
          return command.loop.END
        }

        return command.loop.REPEAT
      }

      case 'scrape and enter data': {
        const healthcheck = (await chooseHealthCheckStrategy()) ?? undefined
        const title = await scrapeResourceTitle(url, healthcheck)

        if (!title) {
          log.warning(
            `Scraping failed, try with a different strategy or enter data manually`,
          )
          return command.loop.REPEAT
        }

        const enteredData = await enterResourceData({
          ...data,
          url,
          title,
          healthcheck,
        })

        log.text(format.diff({ url, ...data }, enteredData))

        const confirm = await command.confirm(`Confirm data for ${url}`)

        if (!confirm) {
          return command.loop.REPEAT
        }

        data = enteredData
        return command.loop.END
      }

      case null:
        data = undefined
        return command.loop.END
    }
  })

  if (!data) return

  try {
    const resource = await create(data)
    log.success(`Resource ${resource.id} successfully created`)
    return resource
  } catch (err) {
    log.error(`Error importing ${url}`)
    log.error(err as string)
  }
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

const manageResourceData = async (resource: Resource) => {
  let resourceData = util.clone(resource.data)

  await command.loop(async () => {
    log.lead(`Current resource data`)
    log.inspect(resource.data)
    log.lead(`Resource data update`)
    log.text(format.diff(resource.data, resourceData))

    const action = await command.choice('Choose action', [
      'update resource data',
      'healthcheck resource data update',
      'persist resource data update',
    ])

    switch (action) {
      case 'update resource data':
        resourceData = await enterResourceData(resourceData)
        return command.loop.REPEAT

      case 'healthcheck resource data update': {
        const title = await scrapeResourceTitle(
          resourceData.url,
          resource.healthcheck,
        )

        if (!title) return command.loop.REPEAT

        log.success(`Health check succeeded`)
        log.text(
          format.diff(
            { url: resource.url, title: resource.data.title },
            {
              url: resource.url,
              title,
            },
          ),
        )

        return command.loop.REPEAT
      }

      case 'persist resource data update':
        try {
          await resource.change(resourceData)
          log.success(`Resource update succeeded`)
        } catch (error) {
          log.error(`Resource update failed.`)
          log.error(error as string)
        }
        return command.loop.END

      case null:
        return command.loop.END
    }
  })
}

const deleteResource = async (resource: Resource) => {
  const topics = await getAllByResourceId(resource.id)

  await command.loop(async () => {
    log.inspect(resource.document)
    log.warning(
      `The resource occurs in the following topics:\n${format.stringify(
        topics.map((t) => t.name),
      )}`,
    )

    const action = await command.choice(`Choose action`, [
      'display occurrences',
      'delete resource and update topics',
    ])

    switch (action) {
      case 'display occurrences':
        topics.forEach((t) => {
          const { name, main, resources } = t.data
          log.inspect(
            {
              name,
              main,
              resources,
            },
            {
              highlight: resource.id,
            },
          )
        })
        return command.loop.REPEAT

      case 'delete resource and update topics': {
        const confirmed = await command.confirm(
          `Confirm resource ${resource.id} removal`,
        )

        if (!confirmed) return command.loop.REPEAT

        try {
          await Promise.all(
            topics.map((topic) => {
              const main = topic.data.main
                ? topic.data.main.filter((id) => id !== resource.id)
                : null
              const resources = topic.data.resources
                ? topic.data.resources.filter((id) => id !== resource.id)
                : null

              return topic.change({
                main,
                resources,
              })
            }),
          )
          log.success(`Topics updated`)
        } catch (err) {
          log.error(`Error updating topics`)
          log.error(err as string)
        }

        try {
          await resource.delete()
          log.success(`Resource removed`)
        } catch (err) {
          log.error(`Error removing resource`)
          log.error(err as string)
        }

        return command.loop.END
      }

      case null:
        return command.loop.END
    }
  })
}

const compareResource = async (resource: Resource) => {
  await command.loop(async () => {
    log.inspect(resource.document)

    log.lead(`Choose a resource to compare with`)
    const comparedResource = await findResource()

    if (!comparedResource) return command.loop.END

    if (resource.id === comparedResource.id) {
      log.warning(
        `The chosen comparison resource matches the compared resource`,
      )
      return command.loop.REPEAT
    }

    log.text(format.diff(resource.document, comparedResource.document))

    const action = await command.choice(`Choose action`, [
      'choose another resource for comparison',
    ])

    switch (action) {
      case 'choose another resource for comparison':
        return command.loop.REPEAT
      case null:
        return command.loop.END
    }
  })
}

const manageResourceHealthcheck = async (resource: Resource) => {
  let healthcheck = util.clone(resource.healthcheck)

  await command.loop(async () => {
    log.lead(`Current healthcheck strategy`)
    log.inspect(resource.healthcheck)
    log.lead(`Healthcheck strategy update`)
    log.text(format.diff(resource.healthcheck, healthcheck))

    const action = await command.choice(`Choose action`, [
      'run healthcheck',
      'update healthcheck strategy',
      'persist healthcheck strategy',
    ])

    switch (action) {
      case 'run healthcheck': {
        const title = await scrapeResourceTitle(resource.url, healthcheck)

        if (!title) return command.loop.REPEAT

        log.success(`Health check succeeded`)
        log.text(
          format.diff(
            { url: resource.url, title: resource.data.title },
            {
              url: resource.url,
              title,
            },
          ),
        )

        return command.loop.REPEAT
      }

      case 'update healthcheck strategy': {
        const healthcheckUpdate = await chooseHealthCheckStrategy()
        if (!healthcheckUpdate) return command.loop.REPEAT
        healthcheck = healthcheckUpdate
        return command.loop.REPEAT
      }

      case 'persist healthcheck strategy':
        try {
          await resource.change({ healthcheck })
          log.success('Healthcheck strategy updated')
        } catch (err) {
          log.error(`Resource update failed.`)
          log.error(err as string)
        }
        return command.loop.END

      case null:
        return command.loop.END
    }
  })
}

const manageResource = async (resource: Resource) => {
  await command.loop(async () => {
    log.lead(`Resource ${resource.id}`)
    log.inspect(resource.data)
    log.inspect(resource.healthcheck)

    const action = await command.choice('Choose action', [
      'open in browser',
      'manage data',
      'manage healthcheck',
      'compare',
      'delete',
    ])

    switch (action) {
      case 'open in browser':
        await util.open(resource.url)
        return command.loop.REPEAT
      case 'manage data':
        await manageResourceData(resource)
        return command.loop.REPEAT
      case 'manage healthcheck':
        await manageResourceHealthcheck(resource)
        return command.loop.REPEAT
      case 'compare':
        await compareResource(resource)
        return command.loop.REPEAT
      case 'delete':
        await deleteResource(resource)
        return command.loop.END
      case null:
        return command.loop.END
    }
  })
}

const manageResources = async () => {
  await command.loop(async () => {
    const resource = await findResource()

    if (!resource) return command.loop.END

    await manageResource(resource)

    return command.loop.REPEAT
  })
}

export default manageResources
