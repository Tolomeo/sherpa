/* eslint-disable @typescript-eslint/no-unnecessary-condition -- somehow nedb types don't take in account non found docs */
import * as path from 'node:path'
import * as url from 'node:url'
import Db, { type Document } from '../common/db'
import type { FeatureExtraction, FeatureExtractionResult } from './schema'
import {
  FeatureExtractionSchema,
  FeatureExtractionResultSchema,
} from './schema'

const dbFile = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'store.jsonl',
)

const resultsDbDir = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'result',
)

export type FeatureExtractionResultDocument = Document<FeatureExtractionResult>

export type FeatureExtractionDocument = Document<FeatureExtraction>

let FeatureExtractionDataStore: Db<typeof FeatureExtractionSchema>

const FeatureExtractionResultDataStore = new Map<
  string,
  Db<typeof FeatureExtractionResultSchema>
>()

const getResultInstance = async (resultId: string) => {
  const existingResultDataStore = FeatureExtractionResultDataStore.get(resultId)

  if (existingResultDataStore) return existingResultDataStore

  const resultDataStore = await Db.build(FeatureExtractionResultSchema, {
    filename: path.join(resultsDbDir, `${resultId}.jsonl`),
  })

  FeatureExtractionResultDataStore.set(resultId, resultDataStore)

  return resultDataStore
}

const getInstance = async () => {
  if (FeatureExtractionDataStore) return FeatureExtractionDataStore

  FeatureExtractionDataStore = await Db.build(FeatureExtractionSchema, {
    filename: dbFile,
    indexes: [{ fieldName: 'date', unique: true }],
  })

  return FeatureExtractionDataStore
}

export default {
  getInstance,
  getResultInstance,
}
