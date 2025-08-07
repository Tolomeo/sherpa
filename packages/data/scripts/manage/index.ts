import { command } from '../common'
import topic from './topic'
import resource from './resource'

command
  .create()
  .name('@sherpa/data/update')
  .description('Utility to update sherpa topic and resource data')
  .addCommand(topic)
  .addCommand(resource)
  .parse()
