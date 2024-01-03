import { openDB } from 'idb'
import config from '../../../config'
import type { DatabaseSchema, Database } from './types'
import { migrations } from './migrations'

let db: Promise<Database>

const useDB = () => {
  if (typeof window === 'undefined') return

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises
  if (!db) {
    db = openDB<DatabaseSchema>(config.db.name, config.db.version, {
      upgrade: migrations[0],
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
        config.db.store.resourceCompletion.name,
        'readwrite',
      )
      const objectStore = transaction.objectStore(
        config.db.store.resourceCompletion.name,
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
      // eslint-disable-next-line no-console
      console.error(error)
      return false
    }
  }

  const areCompleted = async (resources: string[], topic: string) => {
    if (!database) return resources.map(() => false)

    try {
      const transaction = (await db).transaction(
        config.db.store.resourceCompletion.name,
        'readonly',
      )
      const objectStore = transaction.objectStore(
        config.db.store.resourceCompletion.name,
      )
      const result = await Promise.all(
        resources.map((resource) =>
          objectStore.index('topicResource').get([resource, topic]),
        ),
      )

      return result.map((resourceResult) => Boolean(resourceResult))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return resources.map(() => false)
    }
  }

  const complete = async (resource: string, topic: string) => {
    if (!database) return false

    try {
      const transaction = (await db).transaction(
        config.db.store.resourceCompletion.name,
        'readwrite',
      )
      const objectStore = transaction.objectStore(
        config.db.store.resourceCompletion.name,
      )
      const completed = await objectStore
        .index('topicResource')
        .get([resource, topic])

      if (completed) return true

      await objectStore.add({ topic, resource, createdAt: Date.now() })

      return true
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return false
    }
  }

  const uncomplete = async (resource: string, topic: string) => {
    if (!database) return false

    try {
      const transaction = (await db).transaction(
        config.db.store.resourceCompletion.name,
        'readwrite',
      )
      const objectStore = transaction.objectStore(
        config.db.store.resourceCompletion.name,
      )
      const deletekey = await objectStore
        .index('topicResource')
        .getKey([resource, topic])

      if (!deletekey) return true

      await objectStore.delete(deletekey)
      return true
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return false
    }
  }

  return { areCompleted, complete, uncomplete, prune }
}
