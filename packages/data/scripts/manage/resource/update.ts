import type Resource from '../../../src/resource'
import { format, log, command, util } from '../../common'
import { chooseHealthCheckStrategy, scrapeResourceData } from '../healthcheck'
import { findResource, enterResourceData } from './common'

const updateResourceHealthcheck = async (resource: Resource) => {
  let healthcheck = util.clone(resource.healthcheck)

  await command.loop(async (control) => {
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
        const scrapedData = await scrapeResourceData(resource.url, healthcheck)

        if (!scrapedData) return control.repeat

        log.success(`Health check succeeded`)
        log.text(
          format.diff(
            { url: resource.url, data: resource.data.data },
            {
              url: resource.url,
              data: scrapedData,
            },
          ),
        )

        return control.repeat
      }

      case 'update healthcheck strategy': {
        const healthcheckUpdate = await chooseHealthCheckStrategy()
        if (!healthcheckUpdate) return control.repeat
        healthcheck = healthcheckUpdate
        return control.repeat
      }

      case 'persist healthcheck strategy':
        try {
          await resource.change({ healthcheck })
          log.success('Healthcheck strategy updated')
        } catch (err) {
          log.error(`Resource update failed.`)
          log.error(err as string)
        }
        return control.end

      case null:
        return control.end
    }
  })
}

const updateResourceData = async (resource: Resource) => {
  let resourceData = util.clone(resource.data.data)

  await command.loop(async (control) => {
    log.lead(`Update resource ${resource.url} data`)
    log.inspect(resource.data.data)
    log.lead(`Resource data update`)
    log.text(format.diff(resource.data.data, resourceData))

    const action = await command.choice('Choose action', [
      'scrape resource data',
      'update resource data',
      'persist resource data update',
    ])

    switch (action) {
      case 'scrape resource data': {
        const scrapedData = await scrapeResourceData(
          resource.url,
          resource.healthcheck,
        )

        if (!scrapedData) return control.repeat

        log.success(`Health check succeeded`)
        resourceData = await enterResourceData(resource.url, scrapedData)

        return control.repeat
      }

      case 'update resource data':
        resourceData = await enterResourceData(resource.url, resourceData)
        return control.repeat

      case 'persist resource data update':
        try {
          await resource.change({ data: resourceData })
          log.success(`Resource update succeeded`)
        } catch (error) {
          log.error(`Resource update failed.`)
          log.error(error as string)
        }
        return control.end

      case null:
        return control.end
    }
  })
}

const update = async () => {
  const resource = await findResource()

  if (!resource) return

  await command.loop(async (control) => {
    log.lead(`Resource ${resource.id}`)
    log.inspect(resource.data)
    log.inspect(resource.healthcheck)

    const action = await command.choice('Choose action', [
      'open in browser',
      'update data',
      'update healthcheck',
    ])

    switch (action) {
      case 'open in browser':
        await util.open(resource.url)
        return control.repeat
      case 'update data':
        await updateResourceData(resource)
        return control.repeat
      case 'update healthcheck':
        await updateResourceHealthcheck(resource)
        return control.repeat
      case null:
        return control.end
    }
  })
}

export default update
