import { command } from '../../common'
import add from './add'
import update from './update'

const cmd = command
  .create()
  .name('topic')
  .description('Manage sherpa topic data')

cmd.command('add').description('Update a topic').action(add)

cmd.command('update').description('Update a topic').action(update)

export * from './common'
export default cmd
