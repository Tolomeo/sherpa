import * as path from 'node:path'
import * as url from 'node:url'
import {
  ResourceDataSchema2,
  ResourceData2,
  ResourceType,
} from '../types/resource'
import Db, { migrate } from '../src/common/db'
import From from '../src/resource/store'

/* const dbFile = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'store.1.db',
) */

const dbFile = path.resolve(
  path.dirname(url.fileURLToPath(import.meta.url)),
  '../src/resource/store-1.db',
)

const migrateDb = async () => {
  const to = await Db.build(ResourceDataSchema2, {
    filename: dbFile,
    indexes: { unique: 'url' },
  })

  await From.getInstance().then((from) =>
    migrate(from, to, (fromDoc) => {
      const {
        _id,
        url: fromUrl,
        type: fromType,
        title,
        source,
        healthcheck,
      } = fromDoc

      let type: ResourceData2['type']

      switch (fromType) {
        case ResourceType.basics:
        case ResourceType.advanced:
        case ResourceType['how-to']:
          type = {
            name: 'knowledge',
            variant: fromType as 'basics' | 'advanced' | 'how-to',
          }
          break
        case ResourceType.reference:
        case ResourceType.feed:
          type = {
            name: 'reference',
          }
          break
        case ResourceType.curiosity:
          type = {
            name: 'curiosity',
          }
          break
        case ResourceType.tool:
          type = {
            name: 'tool',
          }
      }

      return {
        _id,
        url: fromUrl,
        data: {
          title,
          source,
        },
        type,
        healthcheck,
      }
    }),
  )
}

console.log(dbFile)
