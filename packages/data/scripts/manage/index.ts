import { Command } from 'commander'
import topic from './topic'
import resource from './resource'

const program = new Command()

program
  .name('@sherpa/data/update')
  .description('Utility to update sherpa topic and resource data')

program.addCommand(topic)

program.addCommand(resource)

program.parse()
