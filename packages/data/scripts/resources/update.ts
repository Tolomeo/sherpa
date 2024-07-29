/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { open, diff, input, choice, log } from '../_utils'
import Resource, { getByUrl } from '../../src/resource'
import Healthcheck from '../../src/healthcheck/runner'
import { ResourceData } from '../../types'

const getResource = async () => {
  let resource: Resource | undefined

  while (!resource) {
    const url = await input(`Enter resource url`)

    if (url === null) return null

    const urlResource = await getByUrl(url)

    if (!urlResource) {
      log.error(`\nResource "${url}" not found`)
      continue
    }

    resource = urlResource
  }

  return resource
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
    log.text(`\nUpdated resource data:\n`)
    log.text(
      `${diff(
        JSON.stringify(resource.data, null, 2),
        JSON.stringify(resourceUpdate, null, 2),
      )}\n`,
    )

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
          log.success(`\nResource update succeeded\n`)
        } catch (error) {
          log.error(`\nResource update failed.\n`)
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
    log.error(`\nHealth check failed\n`)
    log.error(`${healthCheckResult.error}\n`)
    return
  }

  log.success(`\nHealth check succeeded\n`)
  log.text(
    `${diff(
      JSON.stringify({ url, title }, null, 2),
      JSON.stringify(
        {
          url: healthCheckResult.url,
          title: healthCheckResult.data.title,
        },
        null,
        2,
      ),
    )}\n`,
  )

  await healthcheckRunner.teardown()
}

const update = async (resource: Resource) => {
  while (true) {
    log.text(`\n${JSON.stringify(resource.data, null, 2)}`)

    const action = await choice('Choose action', [
      'open',
      'update',
      'healthcheck',
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
      case null:
        return
    }
  }
}

;(async function main() {
  while (true) {
    const resource = await getResource()

    if (resource === null) process.exit(0)

    await update(resource)
  }
})().catch((err) => {
  log.error(err)
  process.exit(1)
})
