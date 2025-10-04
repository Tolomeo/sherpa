import { command } from '../../common'
import add from './add'
import update from './update'
import remove from './remove'
import healthcheck from './healthcheck'

const resourceCommand = command
  .create()
  .name('resource')
  .description('Manage sherpa resource data')

resourceCommand.command('add').description('Add a resource').action(add)

resourceCommand
  .command('update [resourceUrl]')
  .description('Update a resource')
  .action((resourceUrl?: string) => update(resourceUrl))

resourceCommand
  .command('remove')
  .description('Remove a resource')
  .action(remove)

resourceCommand
  .command('healthcheck')
  .description('Check on the health of resources')
  .action(healthcheck)

export * from './common'
export default resourceCommand
