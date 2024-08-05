/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { getAllByResourceId } from '../../src/topic'
import Resource, { getAllByUrl } from '../../src/resource'
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
    const url = await command.input(`Enter url fragment to search for`)

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
    log.error(`${healthCheckResult.error}`)
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

const getResourceDataUpdate = async (resourceData: ResourceData) => {
  const resourceUpdate = util.clone(resourceData)

  for (const [key, value] of Object.entries(resourceData)) {
    const valueUpdate = await command.input(`${key}(${value})`)

    if (!valueUpdate) continue

    resourceUpdate[key] = valueUpdate
  }

  return resourceUpdate
}

const manageResourceData = async (resource: Resource) => {
  let resourceData = util.clone(resource.data)

  await command.loop(async () => {
    log.inspect(resource.data)
    log.text(format.diff(resource.data, resourceData))

    const action = await command.choice('Choose action', [
      'change resource data',
      'healthcheck resource data',
      'persist resource data',
    ])

    switch (action) {
      case 'change resource data':
        resourceData = await getResourceDataUpdate(resourceData)
        return command.loop.REPEAT

      case 'healthcheck resource data':
        await runHealthcheck(resourceData, resource.healthcheck)
        return command.loop.REPEAT

      case 'persist resource data':
        try {
          await resource.change(resourceData)
          log.success(`Resource update succeeded`)
        } catch (error) {
          log.error(`Resource update failed.`)
          log.error(error)
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
      `The resource occurs in the following topics:\n${topics
        .map((t) => t.topic)
        .join(', ')}`,
    )

    const action = await command.choice(`Choose action`, [
      'display occurrences',
      'delete resource and update topics',
    ])

    switch (action) {
      case 'display occurrences':
        topics.forEach((t) => {
          const { topic, main, resources } = t.data
          const display = {
            topic,
            main,
            resources,
          }

          log.inspect(display, {
            highlight: resource.id,
          })
        })
        return command.loop.REPEAT

      case 'delete resource and update topics':
        const confirmed = await command.confirm(`Confirm resource removal`)

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
          log.error(err)
        }

        try {
          await resource.delete()
          log.success(`Resource removed`)
        } catch (err) {
          log.error(`Error removing resource`)
          log.error(err)
        }

        return command.loop.END

      case null:
        return command.loop.END
    }
  })
}

const compareResource = async (resource: Resource) => {
  await command.loop(async () => {
    log.inspect(resource.document)

    log.text(`Choose a resource to compare with`)
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
    log.inspect(resource.healthcheck)
    log.text(format.diff(resource.healthcheck, healthcheck))

    const action = await command.choice(`Choose action`, [
      'run healthcheck',
      'change healthcheck strategy',
      'persist healthcheck strategy',
    ])

    switch (action) {
      case 'run healthcheck':
        await runHealthcheck(resource.data, healthcheck)
        return command.loop.REPEAT

      case 'change healthcheck strategy':
        const healthcheckUpdate = await getHealthcheckUpdate()
        if (!healthcheckUpdate) return command.loop.REPEAT
        healthcheck = healthcheckUpdate
        return command.loop.REPEAT

      case 'persist healthcheck strategy':
        try {
          await resource.change({ healthcheck })
          log.success('Healthcheck strategy updated')
        } catch (err) {
          log.error(`Resource update failed.`)
          log.error(err)
        }
        return command.loop.END

      case null:
        return command.loop.END
    }
  })
}

const manageResource = async (resource: Resource) => {
  await command.loop(async () => {
    log.inspect(resource.document)

    const action = await command.choice('Choose action', [
      'open in browser',
      'manage data',
      'manage healthcheck',
      'compare',
      'delete',
    ])

    switch (action) {
      case 'open in browser':
        util.open(resource.url)
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

;(async function main() {
  await command.loop(async () => {
    log.text(`Search a resource by url`)
    const resource = await getResource()

    if (!resource) return command.loop.END

    await manageResource(resource)

    return command.loop.REPEAT
  })
})().catch((err) => {
  log.error(err)
  process.exit(1)
})
