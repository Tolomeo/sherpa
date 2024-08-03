/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { open, input, choice, log, confirm } from '../_utils'
import { getAllByResourceId } from '../../src/topic'
import Resource, { getByUrl, getAllByUrl } from '../../src/resource'
import Healthcheck from '../../src/healthcheck/runner'
import { ResourceData } from '../../types'

const getResource = async () => {
  let resource: Resource | undefined

  while (!resource) {
    const url = await input(`Enter resource url`)

    if (url === null) return null

    const urlResource = await getByUrl(url)

    if (!urlResource) {
      log.error(`Resource "${url}" not found`)
      continue
    }

    resource = urlResource
  }

  return resource
}

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
        await healthcheck(resourceUpdate, resource.healthcheck)
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

const healthcheck = async (
  { url, title }: ResourceData,
  strategy: NonNullable<ResourceData['healthcheck']>,
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
    log.inspect(resource.data)
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
    log.inspect(resource.data)

    log.text(`Choose a resource to compare with`)
    const comparedResource = await getResource()

    if (!comparedResource) return

    if (resource.id === comparedResource.id) {
      log.warning(
        `The chosen comparison resource matches the compared resource`,
      )
      continue
    }

    log.diff(log.stringify(resource.data), log.stringify(comparedResource.data))

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

const update = async (resource: Resource) => {
  while (true) {
    log.inspect(resource.data)

    const action = await choice('Choose action', [
      'open',
      'update',
      'healthcheck',
      'compare',
      'delete',
    ])

    switch (action) {
      case 'open':
        open(resource.url)
        break
      case 'update':
        await updateResource(resource)
        break
      case 'healthcheck':
        await healthcheck(resource.data, resource.healthcheck)
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
    const action = await choice(`Choose action`, [
      'choose a resource by url',
      'search a resource by url',
    ])

    switch (action) {
      case 'choose a resource by url': {
        log.text(`Choose a resource`)
        const resource = await getResource()
        if (!resource) break
        await update(resource)
        break
      }

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
