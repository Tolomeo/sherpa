import { getAll as getAllResources } from '../../../src/resource'
import { getLastExtraction } from '../../../src/extraction/model'
import { log, format } from '../../common'
import updateResource from './update'

const healthcheck = async () => {
  const extraction = await getLastExtraction()

  if (!extraction) throw new Error('Data extraction not found')

  const resources = await getAllResources()

  const failedHealthChecks = []

  for (const resource of resources) {
    const resourceDataExtraction = await extraction.getResult(resource.url)

    if (!resourceDataExtraction) {
      log.warning(`No extraction data found for url ${resource.url}`)
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

    const extractionData = failedHealthCheck.data

    if (!extractionData.success) {
      log.warning(`Resource data extraction was unsuccessful`)
      log.error(extractionData.error)
    } else {
      log.warning(`Resource data does not match extracted data`)
      log.warning(format.stringify(extractionData))
    }

    await updateResource(failedHealthCheck.url)
    counter++
  }
}

export default healthcheck
