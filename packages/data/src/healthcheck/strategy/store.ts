// eslint-disable @typescript-eslint/no-unnecessary-condition -- somehow nedb types don't take in account non found docs
import * as path from 'node:path'
import * as url from 'node:url'
import Db, { type Document } from '@seald-io/nedb'
import {
  HostnameHealthCheckStrategySchema,
  type HostnameHealthCheckStrategy,
} from '../../../types'

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

type HealthCheckStrategiesDb = Db<HostnameHealthCheckStrategy>

export type HealthCheckStrategyDocument = Document<HostnameHealthCheckStrategy>

export type HealthCheckStrategyDocumentQuery =
  DocumentQuery<HostnameHealthCheckStrategy>

class HealthCheckStrategiesStore {
  private db: HealthCheckStrategiesDb

  constructor() {
    this.db = new Db({ filename: dbFile, autoload: true })
    this.db.ensureIndex({ fieldName: 'resource', unique: true })
  }

  async findAll(query: HealthCheckStrategyDocumentQuery = {}) {
    const docs: HealthCheckStrategyDocument[] = await this.db.findAsync(query)

    return docs
  }

  async insertOne(insert: HostnameHealthCheckStrategy) {
    const insertValidation = HostnameHealthCheckStrategySchema.safeParse(insert)

    if (!insertValidation.success) {
      throw insertValidation.error
    }

    const doc = await this.db.insertAsync(insert)
    await this.db.compactDatafileAsync()

    return doc
  }

  async findOne(query: HealthCheckStrategyDocumentQuery) {
    const doc: Nullable<HealthCheckStrategyDocument> =
      await this.db.findOneAsync(query)

    if (!doc) return null

    return doc
  }

  async updateOne(
    id: string,
    update: HostnameHealthCheckStrategy,
  ): Promise<HealthCheckStrategyDocument> {
    const updateValidation = HostnameHealthCheckStrategySchema.safeParse(update)

    if (!updateValidation.success) {
      throw updateValidation.error
    }

    await this.db.updateAsync({ _id: id }, update)
    await this.db.compactDatafileAsync()

    return {
      ...update,
      _id: id,
    }
  }
}

export default new HealthCheckStrategiesStore()
