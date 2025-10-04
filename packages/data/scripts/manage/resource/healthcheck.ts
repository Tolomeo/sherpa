import { getAll as getAllResources } from '../../../src/resource'
import { getLastExtraction } from '../../../src/extraction/model'
import { log, format, command, util } from '../../common'
import updateResource from './update'
import removeResource from './remove'

const healthcheck = async () => {
  const extraction = await getLastExtraction()

  if (!extraction) throw new Error('Data extraction not found')

  const resources = await getAllResources()

  const failedHealthChecks = []

  for (const resource of resources) {
    const resourceDataExtraction = await extraction.getResult(resource.url)

    if (!resourceDataExtraction) {
      log.error(`No extraction data found for url ${resource.url}`)
      continue
    }

    const isResourceHealthy = resource.isHealthy(resourceDataExtraction)

    if (isResourceHealthy) continue

    failedHealthChecks.push(resourceDataExtraction)
  }

  log.warning(`${failedHealthChecks.length} unsuccessful health-checks`)

  let counter = 1

  for (const failedHealthCheck of failedHealthChecks) {
    log.warning(
      `${counter}/${failedHealthChecks.length} unsuccessful health check`,
    )
    counter++

    const extractionData = failedHealthCheck.data

    if (!extractionData.success) {
      log.lead(`Resource data extraction was unsuccessful`)
    } else {
      log.lead(`Resource data does not match extracted data`)
    }

    log.warning(format.stringify(extractionData))

    await command.loop(async (control) => {
      const action = await command.choice('Choose action', [
        'open',
        'update',
        'remove',
      ])

      switch (action) {
        case 'open':
          await util.open(failedHealthCheck.url)
          return control.repeat
        case 'update':
          await updateResource(failedHealthCheck.url)
          return control.end
        case 'remove':
          await removeResource(failedHealthCheck.url)
          return control.end
        default:
          return control.end
      }
    })
  }
}

export default healthcheck
