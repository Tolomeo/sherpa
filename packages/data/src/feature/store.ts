/* eslint-disable @typescript-eslint/no-unnecessary-condition -- somehow nedb types don't take in account non found docs */
import * as path from 'node:path'
import * as url from 'node:url'
import Db, { type Document } from '../common/db'
import type {
  FeatureExtractionData,
  FeatureExtractionResultData,
} from './schema'
import {
  FeatureExtractionDataSchema,
  FeatureExtractionResultDataSchema,
} from './schema'

const dbFile = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'store.jsonl',
)

const resultsDbDir = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'extraction',
)

export type FeatureExtractionResultDocument =
  Document<FeatureExtractionResultData>

export type FeatureExtractionDocument = Document<FeatureExtractionData>

let FeatureExtractionDataStore: Db<typeof FeatureExtractionDataSchema>

const FeatureExtractionResultDataStore = new Map<
  string,
  Db<typeof FeatureExtractionResultDataSchema>
>()

const getExtractionInstance = async (resultId: string) => {
  const existingResultDataStore = FeatureExtractionResultDataStore.get(resultId)

  if (existingResultDataStore) return existingResultDataStore

  const resultDataStore = await Db.build(FeatureExtractionResultDataSchema, {
    filename: path.join(resultsDbDir, `${resultId}.jsonl`),
  })

  FeatureExtractionResultDataStore.set(resultId, resultDataStore)

  return resultDataStore
}

const getInstance = async () => {
  if (FeatureExtractionDataStore) return FeatureExtractionDataStore

  FeatureExtractionDataStore = await Db.build(FeatureExtractionDataSchema, {
    filename: dbFile,
    indexes: [{ fieldName: 'date', unique: true }],
  })

  return FeatureExtractionDataStore
}

export default {
  getInstance,
  getExtractionInstance,
}
