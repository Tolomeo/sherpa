import { command } from '../../../common'
import { InvalidOptionError } from '../../../common/command'
import run from './run'

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
    const trigger = run.args.trigger(options.trigger, {
      validationError: InvalidOptionError,
    })
    const topics = run.args.topics(args, {
      validationError: InvalidOptionError,
    })
    return run(trigger, topics)
  })

export default cmd
