import { getAll as getAllResources } from '../../../src/resource'
import { getLastExtraction } from '../../../src/extraction/model'
import { log, format } from '../../common'
import updateResource from './update'

const healthcheck = async () => {
  const extraction = await getLastExtraction()

  if (!extraction) throw new Error('Data extraction not found')

  const resources = await getAllResources()

  const failures = []

  for (const resource of resources) {
    const resourceDataExtraction = await extraction.getResult(resource.url)
    const isResourceHealthy = resource.isHealthy(resourceDataExtraction)

    if (isResourceHealthy) continue

    failures.push(resourceDataExtraction)
  }

  log.warning(`${failures.length} unsuccessful health-checks`)

  let counter = 1

  for (const failure of failures) {
    log.warning(`${counter}/${failures.length} unsuccessful health check`)

    const extractionData = failure.data

    if (!extractionData.success) {
      log.warning(`Resource data extraction was unsuccessful`)
      log.error(extractionData.error)
    } else {
      log.warning(`Resource data does not match extracted data`)
      log.warning(format.stringify(extractionData))
    }

    await updateResource(failure.url)
    counter++
  }
}

export default healthcheck
