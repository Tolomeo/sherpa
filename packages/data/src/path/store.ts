/* eslint-disable @typescript-eslint/no-unnecessary-condition -- somehow nedb types don't take in account non found docs */
import * as path from 'node:path'
import * as url from 'node:url'
import Db, { type Document } from '@seald-io/nedb'
import {
  type SerializedPath,
  type Path,
  // PathSchema,
  SerializedPathSchema,
  PathSchema,
} from './schema'

const dbFile = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'store.db',
)

type Nullable<T> = T | null

export type PathDocument = Document<Path>

class PathsStore {
  private db: Db<SerializedPath>

  constructor() {
    this.db = new Db({ filename: dbFile, autoload: true })
    this.db.ensureIndex({ fieldName: 'topic', unique: true }, (err) => {
      if (err) throw err
    })
  }

  private async populate(
    serializedPath: Document<SerializedPath>,
  ): Promise<Document<Path>> {
    const {
      _id,
      topic = null,
      logo = null,
      hero = null,
      notes = null,
      resources = null,
      main = null,
      children = null,
      prev = null,
      next = null,
    } = serializedPath

    return {
      _id,
      topic: topic!,
      logo,
      hero,
      notes,
      resources,
      main,
      children: await (async () => {
        if (!children) return null

        const childPaths: Path[] = []

        for (const childTopic of children) {
          const child = await this.findOneByTopic(childTopic)
          if (child) childPaths.push(child)
        }

        return childPaths
      })(),
      prev,
      next,
    }
  }

  async getAll() {
    const docs: Document<SerializedPath>[] = await this.db.findAsync({})
    const paths: PathDocument[] = []

    for (const doc of docs) {
      paths.push(await this.populate(doc))
    }

    return paths
  }

  async insertOne(newPath: SerializedPath) {
    const newPathValidation = SerializedPathSchema.safeParse(newPath)

    if (!newPathValidation.success) {
      console.error(`Path ${newPath.topic} validation error`)
      throw newPathValidation.error
    }

    const doc = await this.db.insertAsync(newPath)
    await this.db.compactDatafileAsync()

    return doc
  }

  async updateOne(id: string, update: SerializedPath) {
    const validation = PathSchema.safeParse(update)

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
    const doc: Nullable<Document<SerializedPath>> = await this.db.findOneAsync({
      topic,
    })

    if (!doc) return null

    return this.populate(doc)
  }

  async findAll() {
    const docs: Document<SerializedPath>[] = await this.db.findAsync({})

    const all = []

    for (const doc of docs) {
      all.push(await this.populate(doc))
    }

    return all
  }

  async findAllByTopic(topic: RegExp) {
    const docs: Document<SerializedPath>[] = await this.db.findAsync({
      topic,
    })
    const paths: PathDocument[] = []

    for (const doc of docs) {
      paths.push(await this.populate(doc))
    }

    return paths
  }
}

export default new PathsStore()
