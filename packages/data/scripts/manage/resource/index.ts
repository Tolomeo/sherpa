import { command } from '../../common'
import add from './add'
import update from './update'
import remove from './remove'
import healthcheck from './healthcheck'

const cmd = command
  .create()
  .name('resource')
  .description('Manage sherpa resource data')

cmd.command('add').description('Add a resource').action(add)

cmd
  .command('update [resourceUrl]')
  .description('Update a resource')
  .action((resourceUrl?: string) => update(resourceUrl))

cmd.command('remove').description('Remove a resource').action(remove)

cmd
  .command('healthcheck')
  .description('Check on the health of resources')
  .action(healthcheck)

export * from './common'
export default cmd
