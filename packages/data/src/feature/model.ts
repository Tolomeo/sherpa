import * as path from 'node:path'
import * as url from 'node:url'
// import * as fs from 'node:fs'
import type { FeatureExtractionDataDocument } from './store'
import Db from './store'

const results = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'result',
)

/* const getExtractName = (now = new Date()) => {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const timestamp = `${year}-${month}-${day}`
  const filename = `${timestamp}.jsonl`

  return filename
} */

export const create = async () => {
  const now = new Date()
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const existingDoc = await getByDate(date)
  if (existingDoc) {
    throw new Error(`Feature DB already exists for date ${date.toISOString()}`)
  }

  const doc = await Db.getInstance().then((db) => db.insertOne({ date }))

  return new FeatureExtraction(doc)
  /* const dbFilename = `${_id}.jsonl`
  const dbFilepath = path.join(extracts, dbFilename)

  const dbFileExists = fs.existsSync(dbFilepath)
  if (dbFileExists) {
    throw new Error(
      `Feature DB file ${dbFilename} already exists at ${dbFilepath}`,
    )
  }

  fs.writeFileSync(dbFilepath, '') */
}

export const getByDate = async (findDate: Date) => {
  const date = new Date(
    findDate.getFullYear(),
    findDate.getMonth(),
    findDate.getDate(),
  )

  const doc = await Db.getInstance().then((db) => db.findOne({ date }))

  if (!doc) return null

  return new FeatureExtraction(doc)
}

class FeatureExtraction {
  private document: FeatureExtractionDataDocument

  constructor(document: FeatureExtractionDataDocument) {
    this.document = document
  }
}
