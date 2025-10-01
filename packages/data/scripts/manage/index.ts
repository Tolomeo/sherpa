import 'dotenv/config'
import { command } from '../common'
import extraction from './extraction'
import topic from './topic'
import resource from './resource'

command
  .create()
  .name('@sherpa/data/update')
  .description('Utility to update sherpa topic and resource data')
  .addCommand(extraction)
  .addCommand(topic)
  .addCommand(resource)
  .parse()
