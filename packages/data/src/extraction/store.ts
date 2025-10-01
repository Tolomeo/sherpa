/* eslint-disable @typescript-eslint/no-unnecessary-condition -- somehow nedb types don't take in account non found docs */
import * as path from 'node:path'
import * as url from 'node:url'
import Db, { type Document } from '../common/db'
import type { ExtractionData, ExtractionResultData } from './schema'
import { ExtractionDataSchema, ExtractionResultDataSchema } from './schema'

const dbFile = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'store.jsonl',
)

const resultsDbDir = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'result',
)

export type ExtractionResultDocument = Document<ExtractionResultData>

export type ExtractionDocument = Document<ExtractionData>

let ExtractionDataStore: Db<typeof ExtractionDataSchema>

const ExtractionResultDataStore = new Map<
  string,
  Db<typeof ExtractionResultDataSchema>
>()

const getExtractionInstance = async (resultId: string) => {
  const existingResultDataStore = ExtractionResultDataStore.get(resultId)

  if (existingResultDataStore) return existingResultDataStore

  const resultDataStore = await Db.build(ExtractionResultDataSchema, {
    filename: path.join(resultsDbDir, `${resultId}.jsonl`),
    indexes: [{ fieldName: 'url', unique: true }],
  })

  ExtractionResultDataStore.set(resultId, resultDataStore)

  return resultDataStore
}

const getInstance = async () => {
  if (ExtractionDataStore) return ExtractionDataStore

  ExtractionDataStore = await Db.build(ExtractionDataSchema, {
    filename: dbFile,
    indexes: [{ fieldName: 'date', unique: true }],
  })

  return ExtractionDataStore
}

export default {
  getInstance,
  getExtractionInstance,
}
