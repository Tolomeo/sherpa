import { command } from '../../../common'
import { InvalidOptionError } from '../../../common/command'
import run, { args as runArgs } from './run'

const cmd = command
  .create()
  .name('extraction')
  .description('Extract sherpa feature data')

cmd
  .command('run [topic...]')
  .description('Extract sherpa feature data')
  .requiredOption(
    '-t, --trigger <trigger>',
    'Feature extraction trigger origin',
  )
  .action((args: string[], options: { trigger: string }) => {
    const trigger = runArgs.trigger(options.trigger, {
      validationError: InvalidOptionError,
    })
    const topics = runArgs.topics(args, {
      validationError: InvalidOptionError,
    })
    return run(trigger, topics)
  })

export default cmd
