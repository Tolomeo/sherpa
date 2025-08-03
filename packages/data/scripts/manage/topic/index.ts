import { Command } from 'commander'
import update from './update'

const command = new Command()

// topic add
// topic update

command.name('topic').description('Manage sherpa topic data')

command.command('update').description('Update a topic').action(update)

export default command
