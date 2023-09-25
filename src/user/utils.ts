import { openDB, DBSchema, IDBPDatabase } from 'idb'
import config from '../config'

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
    value: string[]
  }
}

let db: Promise<IDBPDatabase<Schema>>

const useDB = () => {
  if (typeof window === 'undefined') return

  if (!db) {
    db = openDB<Schema>(dbConfig.name, dbConfig.version, {
      upgrade(db) {
        db.createObjectStore(dbConfig.store.resourceCompletion.name)
      },
    })
  }

  return db
}

export const useResourceCompletion = () => {
  const db = useDB()

  const isCompleted = async (url: string) => {
    if (!db) return false

    const completedUrl = await (
      await db
    ).get(dbConfig.store.resourceCompletion.name, url)

    return completedUrl !== undefined
  }

  const areCompleted = async (urls: string[]) => {
    if (!db) {
      return urls.map(() => false)
    }

    const completedUrls = await (
      await db
    ).getAllKeys(dbConfig.store.resourceCompletion.name)

    return urls.map((url) => completedUrls.includes(url))
  }

  const setCompleted = async (
    url: string,
    topic: (typeof config.topics)[number],
  ) => {
    if (!db) return true

    try {
      const transaction = (await db).transaction(
        dbConfig.store.resourceCompletion.name,
        'readwrite',
      )

      const completed = await transaction.store.get(url)

      if (!completed) {
        await transaction.store.add([topic], url)
        await transaction.done
        return true
      }

      if (completed.includes(topic)) {
        await transaction.done
        return true
      }

      await transaction.store.put([...completed, topic], url)
      await transaction.done
      return true
    } catch (err) {
      throw err
    }
  }

  return {
    isCompleted,
    areCompleted,
    setCompleted,
  }
}
