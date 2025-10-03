import { getAll as getAllResources } from '../../../src/resource'
import { getLastExtraction } from '../../../src/extraction/model'

const healthcheck = async () => {
  const extraction = await getLastExtraction()

  if (!extraction) throw new Error('Data extraction not found')

  const resources = await getAllResources()

  const failures = []

  for (const resource of resources) {
    const resourceDataExtraction = await extraction.getResult(resource.url)
    const isResourceHealthy = resource.isHealthy(resourceDataExtraction)

    if (isResourceHealthy) continue

    failures.push(resource)
  }

  console.log(failures.length)
}

export default healthcheck
