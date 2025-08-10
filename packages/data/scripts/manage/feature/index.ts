import { command } from '../../common'
import extract from './extract'

const cmd = command
  .create()
  .name('feature')
  .description('Manage sherpa feature data')

cmd
  .command('extract')
  .description('Extract sherpa feature data')
  .action(extract)

export default cmd
