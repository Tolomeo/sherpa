import { DBSchema, IDBPDatabase, OpenDBCallbacks } from 'idb'
import config from '../../../config'

export interface DatabaseSchema extends DBSchema {
  [config.db.store.resourceCompletion.name]: {
    key: string
    value: {
      topic: string
      resource: string
      createdAt: number
    }
    indexes: {
      topic: string
      topicResource: [string, string]
    }
  }
}

export type Database = IDBPDatabase<DatabaseSchema>

export type OpenDatabaseCallbacks = OpenDBCallbacks<DatabaseSchema>
