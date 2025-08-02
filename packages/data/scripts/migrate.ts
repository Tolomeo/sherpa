import * as path from 'node:path'
import * as url from 'node:url'
import * as resource from '../types/resource'
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
  const to = await Db.build(resource.ResourceDataSchema2, {
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

      let type: resource.ResourceData2['type']

      switch (fromType) {
        case resource.ResourceType.basics:
        case resource.ResourceType.advanced:
        case resource.ResourceType['how-to']:
          type = {
            name: 'knowledge',
            variant: fromType as 'basics' | 'advanced' | 'how-to',
          }
          break
        case resource.ResourceType.reference:
          type = {
            name: 'reference',
            variant: 'index',
          }
          break
        case resource.ResourceType.feed:
          type = {
            name: 'reference',
            variant: 'feed',
          }
          break
        case resource.ResourceType.curiosity:
          type = {
            name: 'curiosity',
          }
          break
        case resource.ResourceType.tool:
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

migrateDb().catch((err) => {
  console.error(err)
  process.exit()
})
