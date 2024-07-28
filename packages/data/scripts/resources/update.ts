/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { open, diff, input, choice } from '../_utils'
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
      console.log(`\nResource "${url}" not found`)
      continue
    }

    resource = urlResource
  }

  return resource
}

const updateResource = async (resource: Resource) => {
  const resourceUpdate = { ...resource.data }

  for (const [key, value] of Object.entries(resource.data)) {
    const valueUpdate = await input(`${key}(${value})`)

    if (!valueUpdate) continue

    resourceUpdate[key] = valueUpdate
  }

  while (true) {
    console.log(`Updated resource data:\n`)
    console.log(`${JSON.stringify(resourceUpdate, null, 2)}\n`)
    const action = await choice('Choose action', ['persist', 'healthcheck'])

    switch (action) {
      case 'persist':
        try {
          await resource.change(resourceUpdate)
        } catch (error) {
          console.error(`\nResource update failed.\n`)
          console.error(error)
        }
        break
      case 'healthcheck':
        await healthcheck(resourceUpdate, resource.healthcheck)
        break
      case null:
        return
    }
  }

  /* const action = await confirm(
    `Persist changes?\n${JSON.stringify(resourceUpdate, null, 2)}`,
  ) */
}

const healthcheck = async (
  { url, title }: ResourceData,
  strategy: NonNullable<ResourceData['healthcheck']>,
) => {
  const healthcheckRunner = new Healthcheck()
  const healthCheckResult = await healthcheckRunner.run(url, strategy)

  if (!healthCheckResult.success) {
    console.error(`\nHealth check failed\n`)
    console.error(`${healthCheckResult.error}\n`)
    return
  }

  console.log(`\nHealth check succeeded\n`)
  console.log(
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
    console.log(`\n${JSON.stringify(resource.data, null, 2)}`)

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
  console.error(err)
  process.exit(1)
})
