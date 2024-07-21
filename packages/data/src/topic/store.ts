/* eslint-disable @typescript-eslint/no-unnecessary-condition -- somehow nedb types don't take in account non found docs */
import * as path from 'node:path'
import * as url from 'node:url'
import Db, { type Document } from '@seald-io/nedb'
import { type TopicData, TopicDataSchema } from '../../types'

const dbFile = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'store.db',
)

type Nullable<T> = T | null

type DocumentQuery<T extends object> = Partial<
  Document<{
    [K in keyof T]: T[K] extends string
      ? string | RegExp
      : T[K] extends string | null
        ? string | null | RegExp
        : T[K]
  }>
>

type TopicsDb = Db<TopicData>

export type TopicDocument = Document<TopicData>

export type TopicDocumentQuery = DocumentQuery<TopicData>

class TopicsStore {
  private db: TopicsDb

  constructor() {
    this.db = new Db({ filename: dbFile, autoload: true })
    this.db.ensureIndex({ fieldName: 'topic', unique: true }, (err) => {
      if (err) throw err
    })
  }

  async findAll(query: TopicDocumentQuery = {}) {
    const docs: TopicDocument[] = await this.db.findAsync(query)

    return docs
  }

  async findOne(query: TopicDocumentQuery) {
    const doc: Nullable<TopicDocument> = await this.db.findOneAsync(query)

    if (!doc) return null

    return doc
  }

  async insertOne(newPath: TopicData) {
    const newPathValidation = TopicDataSchema.safeParse(newPath)

    if (!newPathValidation.success) {
      console.error(`Path ${newPath.topic} validation error`)
      throw newPathValidation.error
    }

    const doc = await this.db.insertAsync(newPath)
    await this.db.compactDatafileAsync()

    return doc
  }

  async updateOne(id: string, update: TopicData) {
    const validation = TopicDataSchema.safeParse(update)

    if (!validation.success) {
      console.error(`Path ${update.topic} validation error`)
      throw validation.error
    }

    await this.db.updateAsync({ _id: id }, update)
    await this.db.compactDatafileAsync()

    return {
      ...update,
      _id: id,
    }
  }
}

export default new TopicsStore()
