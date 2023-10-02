import { openDB, DBSchema, IDBPDatabase } from 'idb'
// import config from '../config'
// import { Path } from '../../data'

const dbConfig = {
  name: 'sherpa',
  version: 1,
  store: {
    resourceCompletion: {
      name: 'user.resource-completion',
    },
  },
} as const

interface Schema extends DBSchema {
  [dbConfig.store.resourceCompletion.name]: {
    key: string
    value: {
      topic: string
      resource: string
    }
    indexes: {
      topicResource: [string, string]
      topic: string
    }
  }
}

let db: Promise<IDBPDatabase<Schema>>

const useDB = () => {
  if (typeof window === 'undefined') return

  if (!db) {
    db = openDB<Schema>(dbConfig.name, dbConfig.version, {
      upgrade(db) {
        const objectStore = db.createObjectStore(
          dbConfig.store.resourceCompletion.name,
          {
            autoIncrement: true,
          },
        )

        objectStore.createIndex('topicResource', ['resource', 'topic'])
        objectStore.createIndex('topic', 'topic')
      },
    })
  }

  return db
}

export const useResourcesCompletionStore = () => {
  const database = useDB()

  const prune = async (resources: string[], topic: string) => {
    if (!database) return true

    try {
      const transaction = (await db).transaction(
        dbConfig.store.resourceCompletion.name,
        'readwrite',
      )
      const objectStore = transaction.objectStore(
        dbConfig.store.resourceCompletion.name,
      )
      const allByTopic = await objectStore.index('topic').getAll(topic)
      const toBePruned = allByTopic.filter(
        (storedResource) =>
          !resources.find((resource) => resource === storedResource.resource),
      )

      if (!toBePruned.length) return true

      const pruneResource = async (resource: string) => {
        const key = await objectStore
          .index('topicResource')
          .getKey([resource, topic])
        await objectStore.delete(key!)
      }

      await Promise.all(
        toBePruned.map(({ resource }) => pruneResource(resource)),
      )

      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const areCompleted = async (resources: string[], topic: string) => {
    if (!database) return resources.map(() => false)

    try {
      const transaction = (await db).transaction(
        dbConfig.store.resourceCompletion.name,
        'readonly',
      )
      const objectStore = transaction.objectStore(
        dbConfig.store.resourceCompletion.name,
      )
      const result = await Promise.all(
        resources.map((resource) =>
          objectStore.index('topicResource').get([resource, topic]),
        ),
      )

      return result.map((resourceResult) => (resourceResult ? true : false))
    } catch (error) {
      console.error(error)
      return resources.map(() => false)
    }
  }

  const complete = async (resource: string, topic: string) => {
    if (!database) return false

    try {
      const transaction = (await db).transaction(
        dbConfig.store.resourceCompletion.name,
        'readwrite',
      )
      const objectStore = transaction.objectStore(
        dbConfig.store.resourceCompletion.name,
      )
      const completed = await objectStore
        .index('topicResource')
        .get([resource, topic])

      if (completed) return true

      await objectStore.add({ topic, resource })

      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const uncomplete = async (resource: string, topic: string) => {
    if (!database) return false

    try {
      const transaction = (await db).transaction(
        dbConfig.store.resourceCompletion.name,
        'readwrite',
      )
      const objectStore = transaction.objectStore(
        dbConfig.store.resourceCompletion.name,
      )
      const deletekey = await objectStore
        .index('topicResource')
        .getKey([resource, topic])

      if (!deletekey) return true

      await objectStore.delete(deletekey)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  return { areCompleted, complete, uncomplete, prune }
}
