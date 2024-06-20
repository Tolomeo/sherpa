/* eslint-disable no-await-in-loop -- need it */
import * as fs from 'node:fs'
// import * as path from 'node:path'
import * as util from 'node:util'
import Db from '@seald-io/nedb'
import { listPaths, readSerializedPath } from './paths/read'
import { listResources, readResources } from './resources/read'

const {
  positionals: [outDir],
} = util.parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
})

const buildPathsDb = async () => {
  const dbFile = `${outDir}/store/path/store.db`
  const pathsList = listPaths()

  fs.writeFileSync(dbFile, '')

  const db = new Db({ filename: dbFile, autoload: true })
  await db.ensureIndexAsync({ fieldName: 'topic', unique: true })

  for (const pathName of pathsList) {
    const pathData = readSerializedPath(pathName)
    await db.insertAsync({
      topic: pathName,
      ...pathData,
    })
  }
}

const buildResourcesDb = async () => {
  const dbFile = `${outDir}/store/resource/store.db`
  const pathResourcesList = await listResources()

  fs.writeFileSync(dbFile, '')

  const db = new Db({ filename: dbFile, autoload: true })
  await db.ensureIndexAsync({ fieldName: 'url', unique: true })

  for (const pathResources of pathResourcesList) {
    const resoucesData = readResources(pathResources)

    for (const resource of resoucesData) {
      const found = await db.findOneAsync({ url: resource.url })

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- the document is null when not found
      if (found) {
        console.info(`Skipping ${resource.url}`)
        continue
      }

      await db.insertAsync(resource)
    }
  }
}

;(async function main() {
  await buildPathsDb()
  await buildResourcesDb()
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
