import { create } from '../../src/topic'
import { util, format, log, command } from '../common'

const createTopic = async () => {
  const name = await command.input('Enter the new topic name identifier')
  const topic = await create({
    name,
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

  log.inspect(topic.data)
}

const manageTopics = async () => {
  await command.loop(async () => {
    const action = await command.choice('Choose action', ['create a new topic'])

    switch (action) {
      case 'create a new topic':
        await createTopic()
        return command.loop.REPEAT

      case null:
        return command.loop.END
    }
  })
}

export default manageTopics
