import { Command } from 'commander'
import add from './add'
import update from './update'
import remove from './remove'

const command = new Command()

command.name('resource').description('Manage sherpa resource data')

command.command('add').description('Add a resource').action(add)

command.command('update').description('Update a resource').action(update)

command.command('remove').description('Remove a resource').action(remove)

export * from './common'
export default command
