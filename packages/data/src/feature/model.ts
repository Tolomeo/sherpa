import type {
  FeatureExtractionDocument,
  FeatureExtractionResultDocument,
} from './store'
import type { FeatureExtractionResultData } from './schema'
import Db from './store'

const toDateOnly = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const create = async () => {
  const date = toDateOnly(new Date())

  const existingDoc = await getByDate(date)
  if (existingDoc) {
    throw new Error(`Feature DB already exists for date ${date.toISOString()}`)
  }

  const doc = await Db.getInstance().then((db) => db.insertOne({ date }))

  return new FeatureExtraction(doc)
}

export const getByDate = async (findDate: Date) => {
  const date = toDateOnly(findDate)

  const doc = await Db.getInstance().then((db) => db.findOne({ date }))

  if (!doc) return null

  return new FeatureExtraction(doc)
}

class FeatureExtractionResult {
  constructor(private document: FeatureExtractionResultDocument) {}

  get url() {
    return this.document.url
  }
}

class FeatureExtraction {
  private document: FeatureExtractionDocument

  constructor(document: FeatureExtractionDocument) {
    this.document = document
  }

  async setResult(data: FeatureExtractionResultData) {
    const { _id: id } = this.document

    return Db.getResultInstance(id).then(async (resultsDb) => {
      await resultsDb.insertOne(data)
    })
  }

  async getResults() {
    const { _id: id } = this.document

    return Db.getResultInstance(id).then(async (resultsDb) => {
      const resultDocs = await resultsDb.findAll()

      return resultDocs.map((doc) => new FeatureExtractionResult(doc))
    })
  }
}
