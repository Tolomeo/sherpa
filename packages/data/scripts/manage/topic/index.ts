import { Command } from 'commander'
import add from './add'
import update from './update'

const command = new Command()

command.name('topic').description('Manage sherpa topic data')

command.command('add').description('Update a topic').action(add)

command.command('update').description('Update a topic').action(update)

export * from './util'
export default command
