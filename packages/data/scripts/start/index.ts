import { log, command } from '../common'
import managePaths from './path'
import manageResources from './resource'

const main = async () => {
  await command.loop(async () => {
    const action = await command.choice('Choose action', [
      'manage paths',
      'manage resources',
    ])

    switch (action) {
      case 'manage paths':
        managePaths()
        return command.loop.REPEAT
      case 'manage resources':
        await manageResources()
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
