import { command } from '../../../common'
import { InvalidOptionError } from '../../../common/command'
import run, { args } from './run'

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
  .action((options: { trigger: string }) => {
    const trigger = args.trigger(options.trigger, InvalidOptionError)
    return run(trigger)
  })

export default cmd
