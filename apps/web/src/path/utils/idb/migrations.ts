import config from '../../../config'
import type { Database, OpenDatabaseCallbacks } from './types'

export const migrations: OpenDatabaseCallbacks['upgrade'][] = [
  (db: Database) => {
    const objectStore = db.createObjectStore(
      config.db.store.resourceCompletion.name,
      {
        autoIncrement: true,
      },
    )

    objectStore.createIndex('topic', 'topic')
    objectStore.createIndex('topicResource', ['resource', 'topic'])
  },
]
