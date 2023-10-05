import { Database, dbConfig, OpenDatabaseCallbacks } from './types'

export const migrations: Array<OpenDatabaseCallbacks['upgrade']> = [
  (db: Database) => {
    const objectStore = db.createObjectStore(
      dbConfig.store.resourceCompletion.name,
      {
        autoIncrement: true,
      },
    )

    objectStore.createIndex('topic', 'topic')
    objectStore.createIndex('topicResource', ['resource', 'topic'])
  },
]
