import { command } from '../../../common'
import run, { cliOption } from './run'

const cmd = command
  .create()
  .name('extraction')
  .description('Extract sherpa feature data')

cmd
  .command('run')
  .description('Extract sherpa feature data')
  .requiredOption(
    '-t, --trigger <trigger>',
    'Feature extraction trigger origin',
  )
  .action((options: { trigger: string }) =>
    run(cliOption.trigger(options.trigger)),
  )

export default cmd
