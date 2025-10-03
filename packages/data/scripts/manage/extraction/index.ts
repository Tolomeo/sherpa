import { command } from '../../common'
import { InvalidOptionError } from '../../common/command'
import run from './run'

const cmd = command
  .create()
  .name('extraction')
  .description('Manage extraction data')

cmd
  .command('run')
  .description('Run a new data extraction')
  .requiredOption(
    '-t, --trigger <trigger>',
    'Feature extraction trigger origin',
  )
  .action((options: { trigger: string }) => {
    const trigger = run.args.trigger(options.trigger, {
      validationError: InvalidOptionError,
    })

    return run(trigger)
  })

export default cmd
