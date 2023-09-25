import { openDB, DBSchema, IDBPDatabase } from 'idb'

const config = {
  name: 'sherpa',
  version: 1,
  store: {
    resourceCompletion: {
      name: 'user.resource-completion',
    },
  },
} as const

interface Schema extends DBSchema {
  'user.resource-completion': {
    key: string
    value: string[]
  }
}

let db: Promise<IDBPDatabase<Schema>>

const useDB = () => {
  if (typeof window === 'undefined') return

  if (!db) {
    db = openDB<Schema>(config.name, config.version, {
      upgrade(db) {
        db.createObjectStore(config.store.resourceCompletion.name)
      },
    })
  }

  return db
}

export const useResourceCompletion = () => {
  const db = useDB()

  const isCompleted = async (url: string) => {
    if (!db) return false

    const result = await (
      await db
    ).get(config.store.resourceCompletion.name, url)

    return result !== undefined
  }

  const areCompleted = async (urls: string[]) => {
    if (!db) {
      return urls.map(() => false)
    }

    const result = await (
      await db
    ).getAllKeys(config.store.resourceCompletion.name)

    return urls.map((url) => result.includes(url))
  }

  return {
    isCompleted,
    areCompleted,
  }
}
