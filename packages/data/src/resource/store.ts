/* eslint-disable @typescript-eslint/no-unnecessary-condition -- somehow nedb types don't take in account non found docs */
import * as path from 'node:path'
import * as url from 'node:url'
import Db, { type Document } from '@seald-io/nedb'
import { ResourceDataSchema, type ResourceData } from '../../types'

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

type ResourceDb = Db<ResourceData>

export type ResourceDocument = Document<ResourceData>

export type ResourceDocumentQuery = DocumentQuery<ResourceData>

class ResourcesStore {
  private db: ResourceDb

  constructor() {
    this.db = new Db({ filename: dbFile, autoload: true })
    this.db.ensureIndex({ fieldName: 'url', unique: true }, (err) => {
      if (err) throw err
    })
  }

  async findAll(query: ResourceDocumentQuery = {}) {
    const docs: ResourceDocument[] = await this.db.findAsync(query)

    return docs
  }

  async findOne(query: ResourceDocumentQuery) {
    const doc = await this.db.findOneAsync(query)

    if (!doc) return null

    return doc
  }

  async updateOne(
    id: string,
    resource: ResourceData,
  ): Promise<ResourceDocument> {
    const resourceValidation = ResourceDataSchema.safeParse(resource)

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
}

export default new ResourcesStore()
