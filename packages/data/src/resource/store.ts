/* eslint-disable @typescript-eslint/no-unnecessary-condition -- somehow nedb types don't take in account non found docs */
import * as path from 'node:path'
import * as url from 'node:url'
import Db, { type Document } from '../common/db'
import { ResourceDataSchema, ResourceData } from '../../types'

const dbFile = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'store.db',
)

export type ResourceDocument = Document<ResourceData>

const ResourceStore = new Db(dbFile, ResourceDataSchema, {
  uniqueFieldName: 'url',
})

export default ResourceStore
