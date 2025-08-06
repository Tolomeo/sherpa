import { create } from '../../../src/topic'
import { log, command } from '../../common'

const add = async () => {
  await command.loop(async (control) => {
    const topicName = await command
      .input('Enter the new topic name identifier')
      .then((enteredName) => (enteredName ? enteredName : null))

    if (!topicName) {
      return control.end
    }

    try {
      await create({
        name: topicName,
        status: 'draft',
        logo: null,
        hero: null,
        notes: null,
        main: null,
        resources: null,
        next: null,
        prev: null,
        children: null,
      })
      log.success(`Topic ${topicName} created successfully`)
    } catch (err) {
      log.error(`Error creating "${topicName}" topic`)
      log.error(err as string)
    }

    return control.end
  })
}

export default add
