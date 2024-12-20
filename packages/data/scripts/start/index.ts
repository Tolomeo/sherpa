import 'dotenv/config'
import { log, command } from '../common'
import manageTopics from './topic'
import manageResources from './resource'
import bulkOperations from './bulk'

const main = async () => {
  await command.loop(async () => {
    const action = await command.choice('Choose action', [
      'manage topics',
      'manage resources',
      'bulk operations',
    ])

    switch (action) {
      case 'manage topics':
        await manageTopics()
        return command.loop.REPEAT
      case 'manage resources':
        await manageResources()
        return command.loop.REPEAT
      case 'bulk operations':
        await bulkOperations()
        return command.loop.REPEAT
      case null:
        return command.loop.END
    }
  })
}

main().catch((err) => {
  log.error(err as string)
  process.exit(1)
})
