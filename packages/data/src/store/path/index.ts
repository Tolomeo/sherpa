/* eslint-disable @typescript-eslint/no-unnecessary-condition -- somehow nedb types don't take in account non found docs */
import * as path from 'node:path'
import * as url from 'node:url'
import Db, { type Document } from '@seald-io/nedb'
import type { SerializedPath, Path, PathTopic } from './schema'

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
      topic: topic as PathTopic,
      logo,
      hero,
      notes,
      resources,
      main,
      children: await (async () => {
        if (!children) return null

        const childrenPaths: Path[] = []

        for (const childTopic of children) {
          const child = await this.findOneByTopic(childTopic)
          if (child) childrenPaths.push()
        }

        return childrenPaths
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

  async findOneByTopic(topic: string) {
    const doc: Nullable<Document<SerializedPath>> = await this.db.findOneAsync({
      topic,
    })

    if (!doc) return null

    return this.populate(doc)
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
