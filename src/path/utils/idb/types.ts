import { DBSchema, IDBPDatabase, OpenDBCallbacks } from 'idb'

export const dbConfig = {
  name: 'sherpa',
  version: 1,
  store: {
    resourceCompletion: {
      name: 'user.resource-completion',
    },
  },
} as const

export interface DatabaseSchema extends DBSchema {
  [dbConfig.store.resourceCompletion.name]: {
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
