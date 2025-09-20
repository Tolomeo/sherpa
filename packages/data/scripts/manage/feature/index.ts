import { command } from '../../common'
import extraction from './extraction'

const cmd = command
  .create()
  .name('feature')
  .description('Manage sherpa feature data')

cmd
  .command('extraction')
  .description('Extract sherpa feature data')
  .action(extraction)

export default cmd
