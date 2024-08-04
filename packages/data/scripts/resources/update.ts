/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { clone, open, input, choice, log, confirm } from '../_utils'
import { getAllByResourceId } from '../../src/topic'
import Resource, { getAllByUrl } from '../../src/resource'
import Healthcheck from '../../src/healthcheck/runner'
import {
  HealthCheckStrategies,
  type ResourceData,
  type HealthcheckStrategy,
} from '../../types'

const getResource = async () => {
  while (true) {
    const url = await input(`Enter url fragment to search for`)

    if (!url) return

    const resources = await getAllByUrl(url)

    if (!resources.length) {
      log.warning(`No results found`)
      continue
    }

    if (resources.length === 1) {
      log.success(`1 result found`)
      return resources[0]
    }

    log.success(`${resources.length} results found`)

    const action = await choice(
      `Select resource`,
      resources.map((r) => r.url),
    )

    if (!action) continue

    const resource = resources.find((r) => r.url === action)

    return resource
  }
}

const runHealthcheck = async (
  { url, title }: ResourceData,
  strategy: HealthcheckStrategy,
) => {
  const healthcheckRunner = new Healthcheck()
  const healthCheckResult = await healthcheckRunner.run(url, clone(strategy))

  if (!healthCheckResult.success) {
    log.error(`Health check failed`)
    log.error(`${healthCheckResult.error}`)
    return
  }

  log.success(`Health check succeeded`)
  log.diff(
    log.stringify({ url, title }),
    log.stringify({
      url: healthCheckResult.url,
      title: healthCheckResult.data.title,
    }),
  )

  await healthcheckRunner.teardown()
}

const getResourceDataUpdate = async (resourceData: ResourceData) => {
  const resourceUpdate = clone(resourceData)

  for (const [key, value] of Object.entries(resourceData)) {
    const valueUpdate = await input(`${key}(${value})`)

    if (!valueUpdate) continue

    resourceUpdate[key] = valueUpdate
  }

  return resourceUpdate
}

const manageResourceData = async (resource: Resource) => {
  let resourceData = clone(resource.data)

  while (true) {
    log.inspect(resource.data)
    log.diff(log.stringify(resource.data), log.stringify(resourceData))

    const action = await choice('Choose action', [
      'change resource data',
      'healthcheck resource data',
      'persist resource data',
    ])

    switch (action) {
      case 'change resource data':
        resourceData = await getResourceDataUpdate(resourceData)
        continue
      case 'healthcheck resource data':
        await runHealthcheck(resourceData, resource.healthcheck)
        continue
      case 'persist resource data':
        try {
          await resource.change(resourceData)
          log.success(`Resource update succeeded`)
        } catch (error) {
          log.error(`Resource update failed.`)
          log.error(error)
        }
        return
      case null:
        return
    }
  }
}

const deleteResource = async (resource: Resource) => {
  const topics = await getAllByResourceId(resource.id)

  while (true) {
    log.inspect(resource.document)
    log.warning(
      `The resource occurs in the following topics:\n${topics
        .map((t) => t.topic)
        .join(', ')}`,
    )

    const action = await choice(`Choose action`, [
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
        break

      case 'delete resource and update topics':
        const confirmed = await confirm(`Confirm resource removal`)

        if (!confirmed) break

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

        return

      case null:
        return
    }
  }
}

const compareResource = async (resource: Resource) => {
  while (true) {
    log.inspect(resource.document)

    log.text(`Choose a resource to compare with`)
    const comparedResource = await getResource()

    if (!comparedResource) return

    if (resource.id === comparedResource.id) {
      log.warning(
        `The chosen comparison resource matches the compared resource`,
      )
      continue
    }

    log.diff(
      log.stringify(resource.document),
      log.stringify(comparedResource.document),
    )

    const action = await choice(`Choose action`, [
      'choose another resource for comparison',
    ])

    switch (action) {
      case 'choose another resource for comparison':
        continue
      case null:
        return
    }
  }
}

const getHealthcheckUpdate = async () => {
  const healthcheck = await choice(
    `Choose a strategy`,
    Object.keys(HealthCheckStrategies),
  )

  if (!healthcheck) return

  const strategy =
    HealthCheckStrategies[healthcheck as HealthcheckStrategy['runner']]

  return clone(strategy)
}

const manageResourceHealthcheck = async (resource: Resource) => {
  let healthcheck = clone(resource.healthcheck)

  while (true) {
    log.inspect(resource.healthcheck)
    log.diff(log.stringify(resource.healthcheck), log.stringify(healthcheck))

    const action = await choice(`Choose action`, [
      'run healthcheck',
      'change healthcheck strategy',
      'persist healthcheck strategy',
    ])

    switch (action) {
      case 'run healthcheck':
        await runHealthcheck(resource.data, healthcheck)
        continue

      case 'change healthcheck strategy':
        const healthcheckUpdate = await getHealthcheckUpdate()
        if (!healthcheckUpdate) continue
        healthcheck = healthcheckUpdate
        continue

      case 'persist healthcheck strategy':
        try {
          await resource.change({ healthcheck })
          log.success('Healthcheck strategy updated')
        } catch (err) {
          log.error(`Resource update failed.`)
          log.error(err)
        }
        return

      case null:
        return
    }
  }
}

const manageResource = async (resource: Resource) => {
  while (true) {
    log.inspect(resource.document)

    const action = await choice('Choose action', [
      'open in browser',
      'manage data',
      'manage healthcheck',
      'compare',
      'delete',
    ])

    switch (action) {
      case 'open in browser':
        open(resource.url)
        break
      case 'manage data':
        await manageResourceData(resource)
        break
      case 'manage healthcheck':
        await manageResourceHealthcheck(resource)
        break
      case 'compare':
        await compareResource(resource)
        break
      case 'delete':
        await deleteResource(resource)
      case null:
        return
    }
  }
}

;(async function main() {
  while (true) {
    log.text(`Search a resource by url`)

    const resource = await getResource()

    if (!resource) process.exit(0)

    await manageResource(resource)
  }
})().catch((err) => {
  log.error(err)
  process.exit(1)
})
