import { Command } from 'commander'
import add from './add'

const command = new Command()

// resource add
// resource update
// resource delete

command.name('resource').description('Manage sherpa resource data')

command.command('add').description('Add a resource').action(add)

// command.command('update').description('Update a resource').action(update)

export default command
