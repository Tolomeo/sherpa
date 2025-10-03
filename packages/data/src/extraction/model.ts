import { toDateOnly } from '../common/date'
import type { ExtractionDocument, ExtractionResultDocument } from './store'
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

  return new Extraction(doc)
}

export const getExtractionByDate = async (findDate: Date) => {
  const date = toDateOnly(findDate)

  const doc = await Db.getInstance().then((db) => db.findOne({ date }))

  if (!doc) return null

  return new Extraction(doc)
}

export const getLastExtraction = async () => {
  const [doc] = await Db.getInstance().then((db) =>
    db.query(
      {},
      {
        sort: {
          date: -1,
        },
        limit: 1,
      },
    ),
  )

  if (!doc) return null

  return new Extraction(doc)
}

export const getAll = async () => {
  const docs = await Db.getInstance().then((db) => db.findAll())

  return docs.map((d) => new Extraction(d))
}

class ExtractionResult {
  constructor(private document: ExtractionResultDocument) {}

  get data() {
    const { _id, ...data } = this.document

    return data
  }

  get url() {
    return this.data.url
  }

  get success() {
    return this.data.success
  }
}

class Extraction {
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

  async getResult(url: ExtractionResultData['url']) {
    const { _id: id } = this.document

    return Db.getExtractionInstance(id).then(async (resultsDb) => {
      const resultDoc = await resultsDb.findOne({ url })

      if (!resultDoc) throw new Error(`No extraction results for url "${url}"`)

      return new ExtractionResult(resultDoc)
    })
  }

  async getResults() {
    const { _id: id } = this.document

    return Db.getExtractionInstance(id).then(async (resultsDb) => {
      const resultDocs = await resultsDb.findAll()

      return resultDocs.map((doc) => new ExtractionResult(doc))
    })
  }
}
