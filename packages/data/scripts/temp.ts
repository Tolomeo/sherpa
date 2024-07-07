// import { getAll as getAllResources } from '../src/resource'
import { getAll as getAllPaths } from '../src/path'

/* const updateResources = async () => {
  const allResources = await getAllResources()

  for (const resource of allResources) {
    const data = await resource.get()

    if (!data) throw new Error(`Resource ${resource.url} data not found`)

    await resource.change(data)
  }
} */

const updatePaths = async () => {
  const allPaths = await getAllPaths()

  for (const path of allPaths) {
    const data = await path.get()

    if (!data) throw new Error(`Path ${path.topic} data not found`)

    await path.change(data)
  }
}

;(async function main() {
  // await updateResources()
  await updatePaths()
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
