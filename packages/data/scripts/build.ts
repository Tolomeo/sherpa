import * as fs from 'node:fs'
import * as path from 'node:path'
import * as util from 'node:util'
// import { listPaths, readPath } from './paths/read'
// import pathsData from '../src/store/paths'
import { listResources, readResources } from './resources/read'

const {
  positionals: [outDir],
} = util.parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
})

if (!outDir) {
  console.error('An output directory must be specified')
  console.error('For example: tsx scripts/build.ts dist')
  process.exit(1)
}

/* const buildPaths = async () => {
  const pathsDest = `${outDir}/paths`
  const topics = await pathsData.getAll()

  fs.mkdirSync(pathsDest, { recursive: true })

  for (const topic of topics) {
    const pathDest = path.join(pathsDest, `${topic.topic}.json`)
    fs.writeFileSync(pathDest, JSON.stringify(topic))
  }
} */

const buildResources = async () => {
  const resourcesDest = `${outDir}/resources`
  const pathResourcesList = await listResources()

  fs.mkdirSync(resourcesDest, { recursive: true })

  for (const pathResources of pathResourcesList) {
    const resourceDest = path.join(resourcesDest, `${pathResources}.json`)
    const resoucesData = readResources(pathResources)
    fs.writeFileSync(resourceDest, JSON.stringify(resoucesData))
  }
}

;(async function main() {
  await buildResources()
  // await buildPaths()
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
