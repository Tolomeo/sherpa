/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { open, input, choice, log, confirm } from '../_utils'
import { getAllByResourceId } from '../../src/topic'
import Resource, { getAllByUrl } from '../../src/resource'
import Healthcheck from '../../src/healthcheck/runner'
import {
  HealthCheckStrategies,
  type ResourceData,
  type HealthcheckStrategy,
} from '../../types'

const searchResource = async () => {
  while (true) {
    const url = await input(`Enter url search`)

    if (!url) return

    const resources = await getAllByUrl(url)

    if (!resources.length) {
      log.warning(`No resources found`)
      continue
    }

    log.success(`${resources.length} found`)

    if (resources.length === 1) {
      return resources[0]
    }

    const action = await choice(
      `Select resource`,
      resources.map((r) => r.url),
    )

    if (!action) continue

    const resource = resources.find((r) => r.url === action)

    return resource
  }
}

const getResourceUpdate = async (resourceData: ResourceData) => {
  const resourceUpdate = { ...resourceData }

  for (const [key, value] of Object.entries(resourceData)) {
    const valueUpdate = await input(`${key}(${value})`)

    if (!valueUpdate) continue

    resourceUpdate[key] = valueUpdate
  }

  return resourceUpdate
}

const updateResource = async (resource: Resource) => {
  let resourceUpdate = await getResourceUpdate(resource.data)

  while (true) {
    log.text(`Updated resource data:`)
    log.diff(log.stringify(resource.data), log.stringify(resourceUpdate))

    const action = await choice('Choose action', [
      'change',
      'healthcheck',
      'persist',
    ])

    switch (action) {
      case 'change':
        resourceUpdate = await getResourceUpdate(resourceUpdate)
        continue
      case 'healthcheck':
        await runHealthcheck(resourceUpdate, resource.healthcheck)
        continue
      case 'persist':
        try {
          await resource.change(resourceUpdate)
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

const runHealthcheck = async (
  { url, title }: ResourceData,
  strategy: HealthcheckStrategy,
) => {
  const healthcheckRunner = new Healthcheck()
  const healthCheckResult = await healthcheckRunner.run(url, strategy)

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

        await Promise.all(
          topics.map((topic) =>
            topic.change({
              main: topic.data.main
                ? topic.data.main.filter((id) => id !== resource.id)
                : null,
              resources: topic.data.resources
                ? topic.data.resources.filter((id) => id !== resource.id)
                : null,
            }),
          ),
        ).catch((err) => {
          log.error(`Error updating topics`)
          log.error(err)
          process.exit(1)
        })

        log.success(`Topics updated`)

        await resource.delete()

        log.success(`Resource removed`)

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
    const comparedResource = await searchResource()

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
      'choose another resource to compare with',
    ])

    switch (action) {
      case 'choose another resource to compare with':
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

  return JSON.parse(JSON.stringify(strategy)) as HealthcheckStrategy
}

const updateHealthcheck = async (resource: Resource) => {
  let healthcheck = JSON.parse(
    JSON.stringify(resource.healthcheck),
  ) as HealthcheckStrategy

  while (true) {
    log.inspect(healthcheck)
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
        healthcheck = await getHealthcheckUpdate()
        if (!healthcheck) return
        continue

      case 'persist healthcheck strategy':
        try {
          await resource.change({ healthcheck: healthcheckUpdate })
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

const update = async (resource: Resource) => {
  while (true) {
    log.inspect(resource.document)

    const action = await choice('Choose action', [
      'open in browser',
      'run healthcheck',
      'update data',
      'update healthcheck',
      'compare',
      'delete',
    ])

    switch (action) {
      case 'open in browser':
        open(resource.url)
        break
      case 'update data':
        await updateResource(resource)
        break
      case 'run healthcheck':
        await runHealthcheck(resource.data, resource.healthcheck)
        break
      case 'update healthcheck':
        await updateHealthcheck(resource)
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
    const action = await choice(`Choose action`, ['search a resource by url'])

    switch (action) {
      case 'search a resource by url': {
        const resource = await searchResource()
        if (!resource) break
        await update(resource)
        break
      }

      case null:
        process.exit(0)
    }
  }
})().catch((err) => {
  log.error(err)
  process.exit(1)
})
