/* eslint-disable @typescript-eslint/no-unnecessary-condition -- somehow nedb types don't take in account non found docs */
import * as path from 'node:path'
import * as url from 'node:url'
import Db, { type Document } from '../common/db'
import { FeatureExtractionDataSchema } from './schema'
import type { FeatureExtractionData } from './schema'

const dbFile = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'store.jsonl',
)

export type FeatureExtractionDataDocument = Document<FeatureExtractionData>

let FeatureExtractionDataStore: Db<typeof FeatureExtractionDataSchema>

// const FeatureExtractStore: Map<string, typeof FeatureExtractSchema> = new Map()

const getInstance = async () => {
  if (FeatureExtractionDataStore) return FeatureExtractionDataStore

  FeatureExtractionDataStore = await Db.build(FeatureExtractionDataSchema, {
    filename: dbFile,
    indexes: { unique: 'date' },
  })

  return FeatureExtractionDataStore
}

export default {
  getInstance,
}
