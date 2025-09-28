import { toDateOnly } from '../common/date'
import type {
  ExtractionDocument,
  ExtractionResultDocument,
} from './store'
import type { ExtractionData, ExtractionResultData } from './schema'
import Db from './store'

export const createExtraction = async (data: ExtractionData) => {
  data.date = toDateOnly(data.date)

  const existingDoc = await getExtractionByDate(data.date)
  if (existingDoc) {
    throw new Error(
      `Feature DB already exists for date ${data.date.toISOString()}`,
    )
  }

  const doc = await Db.getInstance().then((db) => db.insertOne(data))

  return new FeatureExtraction(doc)
}

export const getExtractionByDate = async (findDate: Date) => {
  const date = toDateOnly(findDate)

  const doc = await Db.getInstance().then((db) => db.findOne({ date }))

  if (!doc) return null

  return new FeatureExtraction(doc)
}

export const getLastExtraction = async () => {
  const [doc] = await Db.getInstance().then((db) =>
    db.query(
      {},
      {
        sort: {
          date: 1,
        },
        limit: 1,
      },
    ),
  )

  if (!doc) return null

  return new FeatureExtraction(doc)
}

class FeatureExtractionResult {
  constructor(private document: ExtractionResultDocument) {}

  get url() {
    return this.document.url
  }
}

class FeatureExtraction {
  private document: ExtractionDocument

  constructor(document: ExtractionDocument) {
    this.document = document
  }

  get date() {
    return this.document.date
  }

  async setResult(data: ExtractionResultData) {
    const { _id: id } = this.document

    return Db.getExtractionInstance(id).then(async (resultsDb) => {
      await resultsDb.insertOne(data)
    })
  }

  async setResults(data: Array<ExtractionResultData>) {
    const { _id: id } = this.document

    return Db.getExtractionInstance(id).then((resultsDb) =>
      resultsDb.insertAll(data),
    )
  }

  async getResults() {
    const { _id: id } = this.document

    return Db.getExtractionInstance(id).then(async (resultsDb) => {
      const resultDocs = await resultsDb.findAll()

      return resultDocs.map((doc) => new FeatureExtractionResult(doc))
    })
  }
}
