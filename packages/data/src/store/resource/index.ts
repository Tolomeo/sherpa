/* eslint-disable @typescript-eslint/no-unnecessary-condition -- somehow nedb types don't take in account non found docs */
import * as path from 'node:path'
import * as url from 'node:url'
import Db, { type Document } from '@seald-io/nedb'
import {
  ResourceSchema,
  type Resource,
  type SerializedResource,
} from './schema'

const dbFile = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'store.db',
)

export type ResourceDocument = Document<Resource>

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
  ): ResourceDocument {
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

  async findOneByUrl(resourceUrl: string) {
    const doc = await this.db.findOneAsync({ url: resourceUrl })

    if (!doc) return null

    return this.populate(doc)
  }

  async updateOne(id: string, resource: Resource): Promise<ResourceDocument> {
    const resourceValidation = ResourceSchema.safeParse(resource)

    if (!resourceValidation.success) {
      throw resourceValidation.error
    }

    /* const { url: resourceUrl } = resource

    const equivalentUrl = resourceUrl.endsWith('/')
      ? resourceUrl.slice(0, -1)
      : `${resourceUrl}/`

    const duplicatedResource = await this.findOneByUrl(equivalentUrl)

    if (duplicatedResource) {
      throw new Error(
        `A resource with an equivalent url was found\n${JSON.stringify(
          duplicatedResource,
        )}`,
      )
    } */

    await this.db.updateAsync({ _id: id }, resource)
    await this.db.compactDatafileAsync()

    return {
      ...resource,
      _id: id,
    }
  }

  async findAll(
    query: Partial<Record<keyof SerializedResource, unknown>> = {},
  ) {
    const docs: Document<SerializedResource>[] = await this.db.findAsync(query)

    return docs.map((d) => this.populate(d))
  }
}

export default new ResourcesStore()
