/* eslint-disable @typescript-eslint/no-unnecessary-condition -- somehow nedb types don't take in account non found docs */
import * as path from 'node:path'
import * as url from 'node:url'
import Db, { type Document } from '../common/db'
import { ResourceDataSchema } from '../../types'
import type { ResourceData } from '../../types'

const dbFile = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'store.db',
)

export type ResourceDocument = Document<ResourceData>

let ResourcesStore: Db<typeof ResourceDataSchema>

const getInstance = async () => {
  if (ResourcesStore) return ResourcesStore

  ResourcesStore = await Db.build(ResourceDataSchema, {
    filename: dbFile,
    indexes: { unique: 'url' },
  })

  return ResourcesStore
}

export default {
  getInstance,
}
