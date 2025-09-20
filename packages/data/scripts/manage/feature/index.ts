import { command } from '../../common'
import extraction from './extraction'

const cmd = command
  .create()
  .name('feature')
  .description('Manage sherpa feature data')
  .addCommand(extraction)

export default cmd
