import * as fs from 'node:fs'
import * as path from 'node:path'
import { listPaths, readPath } from '../src/paths/read'
import { listResources, readResources } from '../src/resources/read'

const dest = 'dist'

const buildPaths = async () => {
  const pathsDest = `${dest}/paths`
  const pathsList = await listPaths()

  fs.mkdirSync(pathsDest, { recursive: true })

  for (let pathName of pathsList) {
    const pathDest = path.join(pathsDest, `${pathName}.json`)
    const pathData = readPath(pathName)
    fs.writeFileSync(pathDest, JSON.stringify(pathData))
  }
}

const buildResources = async () => {
  const resourcesDest = `${dest}/resources`
  const pathResourcesList = await listResources()

  fs.mkdirSync(resourcesDest, { recursive: true })

  for (let pathResources of pathResourcesList) {
    const resourceDest = path.join(resourcesDest, `${pathResources}.json`)
    const resoucesData = readResources(pathResources)
    fs.writeFileSync(resourceDest, JSON.stringify(resoucesData))
  }
}

;(async function main() {
  await buildResources()
  await buildPaths()
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
