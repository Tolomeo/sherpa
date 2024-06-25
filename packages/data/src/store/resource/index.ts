/* eslint-disable @typescript-eslint/no-unnecessary-condition -- somehow nedb types don't take in account non found docs */
import * as path from 'node:path'
import * as url from 'node:url'
import Db, { Document } from '@seald-io/nedb'
import type { Resource, SerializedResource } from './schema'

const dbFile = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'store.db',
)

class ResourcesStore {
  private db: Db<SerializedResource>

  constructor() {
    this.db = new Db({ filename: dbFile, autoload: true })
    this.db.ensureIndex({ fieldName: 'url', unique: true }, (err) => {
      if (err) throw err
    })
  }

  private populate(
    serializedResource: Document<SerializedResource>,
  ): Document<Resource> {
    return {
      ...serializedResource,
      source: (() => {
        if (serializedResource.source) return serializedResource.source

        const source = new URL(serializedResource.url)

        switch (source.hostname) {
          case 'github.com':
            return `${source.hostname}/${
              source.pathname.split('/').filter(Boolean)[0]
            }`
          default:
            return source.hostname.replace(/^www./, '')
        }
      })(),
    }
  }

  async findOne(resourceUrl: string) {
    const doc = await this.db.findOneAsync({ url: resourceUrl })

    if (!doc) return null

    return this.populate(doc)
  }

  async findAll(query: Partial<Record<keyof SerializedResource, unknown>>) {
    const docs = await this.db.findAsync(query)

    return docs.map((d) => this.populate(d))
  }
}

export default new ResourcesStore()
