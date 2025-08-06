import { Command } from 'commander'
import topic from './topic'
import resource from './resource'

// TODO: action util
// TODO: align command utils to enquirer api

const program = new Command()

program
  .name('@sherpa/data/update')
  .description('Utility to update sherpa topic and resource data')

program.addCommand(topic)

program.addCommand(resource)

program.parse()
