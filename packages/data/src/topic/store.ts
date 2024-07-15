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

export type TopicDocument = Document<TopicData>

class TopicsDb {
  private db: Db<TopicData>

  constructor() {
    this.db = new Db({ filename: dbFile, autoload: true })
    this.db.ensureIndex({ fieldName: 'topic', unique: true }, (err) => {
      if (err) throw err
    })
  }

  async getAll() {
    const docs: TopicDocument[] = await this.db.findAsync({})

    return docs
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

  async findOneByTopic(topic: string) {
    const doc: Nullable<TopicDocument> = await this.db.findOneAsync({
      topic,
    })

    if (!doc) return null

    return doc
  }

  async findAll() {
    const docs: TopicDocument[] = await this.db.findAsync({})

    return docs
  }

  async findAllByTopic(topic: RegExp) {
    const docs: TopicDocument[] = await this.db.findAsync({
      topic,
    })
    const paths: TopicDocument[] = []

    for (const doc of docs) {
      paths.push(doc)
    }

    return paths
  }
}

export default new TopicsDb()
