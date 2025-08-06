import { command } from '../../common'
import add from './add'
import update from './update'
import remove from './remove'

const cmd = command
  .create()
  .name('resource')
  .description('Manage sherpa resource data')

cmd.command('add').description('Add a resource').action(add)

cmd.command('update').description('Update a resource').action(update)

cmd.command('remove').description('Remove a resource').action(remove)

export * from './common'
export default cmd
