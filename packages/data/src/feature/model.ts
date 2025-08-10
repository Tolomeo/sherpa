import type {
  FeatureExtractionDataDocument,
  FeatureExtractionResultDataDocument,
} from './store'
import Db from './store'

export const create = async () => {
  const now = new Date()
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const existingDoc = await getByDate(date)
  if (existingDoc) {
    throw new Error(`Feature DB already exists for date ${date.toISOString()}`)
  }

  const doc = await Db.getInstance().then((db) => db.insertOne({ date }))

  return new FeatureExtraction(doc)
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

class FeatureExtractionResult {
  constructor(private document: FeatureExtractionResultDataDocument) {}
}

class FeatureExtraction {
  private document: FeatureExtractionDataDocument

  constructor(document: FeatureExtractionDataDocument) {
    this.document = document
  }

  async getResults() {
    const { _id: id } = this.document

    return Db.getResultInstance(id).then((db) =>
      db
        .findAll()
        .then((docs) => docs.map((doc) => new FeatureExtractionResult(doc))),
    )
  }
}
