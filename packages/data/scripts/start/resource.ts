import { getAllByResourceId } from '../../src/topic'
import type Resource from '../../src/resource'
import { getAllByUrl } from '../../src/resource'
import Healthcheck from '../../src/healthcheck/runner'
import {
  HealthCheckStrategies,
  type ResourceData,
  type HealthcheckStrategy,
} from '../../types'
import { util, format, log, command } from '../common'

const getResource = async () => {
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

const runHealthcheck = async (
  { url, title }: ResourceData,
  strategy: HealthcheckStrategy,
) => {
  const healthcheckRunner = new Healthcheck()
  const healthCheckResult = await healthcheckRunner.run(
    url,
    util.clone(strategy),
  )

  if (!healthCheckResult.success) {
    log.error(`Health check failed`)
    log.error(healthCheckResult.error.message)
    return
  }

  log.success(`Health check succeeded`)
  log.text(
    format.diff(
      { url, title },
      {
        url: healthCheckResult.url,
        title: healthCheckResult.data.title,
      },
    ),
  )

  await healthcheckRunner.teardown()
}

type ResourceDataUpdate = Omit<ResourceData, 'healthcheck'>

const getResourceDataUpdate = async (resourceData: ResourceDataUpdate) => {
  const resourceUpdate = util.clone(resourceData)

  for (const [key, value] of Object.entries(resourceData)) {
    const valueUpdate = await command.input(
      `${key} (${format.stringify(value)})`,
    )

    if (!valueUpdate) continue

    // @ts-expect-error -- we will remove the enum this typecheck is complaining about
    resourceUpdate[key] = valueUpdate
  }

  return resourceUpdate
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
        resourceData = await getResourceDataUpdate(resourceData)
        return command.loop.REPEAT

      case 'healthcheck resource data update':
        await runHealthcheck(resourceData, resource.healthcheck)
        return command.loop.REPEAT

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
    const comparedResource = await getResource()

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

const getHealthcheckUpdate = async () => {
  const healthcheck = await command.choice(
    `Choose a strategy`,
    Object.keys(HealthCheckStrategies),
  )

  if (!healthcheck) return

  const strategy =
    HealthCheckStrategies[healthcheck as HealthcheckStrategy['runner']]

  return util.clone(strategy)
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
      case 'run healthcheck':
        await runHealthcheck(resource.data, healthcheck)
        return command.loop.REPEAT

      case 'update healthcheck strategy': {
        const healthcheckUpdate = await getHealthcheckUpdate()
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
    const action = await command.choice('Choose action', [
      'manage existing resources',
      'import resources',
    ])

    switch (action) {
      case 'manage existing resources': {
        const resource = await getResource()

        if (!resource) return command.loop.END

        await manageResource(resource)

        return command.loop.REPEAT
      }
      case 'import resources': {
        console.log('import')
        return command.loop.REPEAT
      }
      case null:
        return command.loop.END
    }
  })
}

export default manageResources
