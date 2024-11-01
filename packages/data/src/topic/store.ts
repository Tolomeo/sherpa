/* eslint-disable @typescript-eslint/no-unnecessary-condition -- somehow nedb types don't take in account non found docs */
import * as path from 'node:path'
import * as url from 'node:url'
import Db, { type Document } from '../common/db'
import { type TopicData, TopicDataSchema } from '../../types'

const dbFile = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'store.db',
)

export type TopicDocument = Document<TopicData>

let TopicsStore: Db<typeof TopicDataSchema>

const getInstance = async () => {
  if (TopicsStore) return TopicsStore

  TopicsStore = await Db.build(TopicDataSchema, {
    filename: dbFile,
    indexes: { unique: 'name' },
  })

  return TopicsStore
}

export default {
  getInstance,
}
