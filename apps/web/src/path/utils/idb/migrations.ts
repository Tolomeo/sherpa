import { Database, OpenDatabaseCallbacks } from './types'
import config from '../../../config'

export const migrations: Array<OpenDatabaseCallbacks['upgrade']> = [
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
