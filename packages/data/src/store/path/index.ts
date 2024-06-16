/* eslint-disable no-await-in-loop -- need it */
import * as path from 'node:path'
import * as url from 'node:url'
import Db from '@seald-io/nedb'
import type { SerializedPath, Path, PathTopic } from './schema'

const dbFile = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'store.db',
)

class Paths {
  private db: Db<SerializedPath>

  constructor() {
    this.db = new Db({ filename: dbFile, autoload: true })
    this.db.ensureIndex({ fieldName: 'topic', unique: true }, (err) => {
      if (err) throw err
    })
  }

  private async populate(serializedPath: SerializedPath): Promise<Path> {
    const {
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
      topic: topic as PathTopic,
      logo,
      hero,
      notes,
      resources,
      main,
      children: await (async () => {
        if (!children) return null

        const childrenPaths: Path[] = []

        for (const child of children) {
          childrenPaths.push(await this.getOne(child))
        }

        return childrenPaths
      })(),
      prev,
      next,
    }
  }

  async getAll() {
    const docs = await this.db.findAsync({})
    const paths: Path[] = []

    for (const doc of docs) {
      paths.push(await this.populate(doc))
    }

    return paths
  }

  async getOne(topic: string) {
    const doc = await this.db.findOneAsync({ topic })

    return this.populate(doc)
  }

  async getRoots() {
    const docs = await this.db.findAsync({ topic: /^[^.]+$/ })
    const paths = []

    for (const doc of docs) {
      paths.push(await this.populate(doc))
    }

    return paths
  }
}

export default new Paths()
