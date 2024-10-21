import { create, getAllByName } from '../../src/topic'
import type Topic from '../../src/topic'
import { log, command } from '../common'

export const findTopic = async () => {
  let topic: Topic | undefined

  await command.loop(async () => {
    const name = await command.input(
      `Search topic - Enter topic name to look for`,
    )

    if (!name) return command.loop.END

    const topics = await getAllByName(name)

    if (!topics.length) {
      log.warning(`No results found`)
      return command.loop.REPEAT
    }

    if (topics.length === 1) {
      topic = topics[0]
      return command.loop.END
    }

    const action = await command.choice(
      `Select topic`,
      topics.map((t) => t.name),
    )

    if (!action) command.loop.REPEAT

    topic = topics.find((t) => t.name === action)

    return command.loop.END
  })

  return topic
}

const createNewTopic = async () => {
  let topic: Topic | undefined

  await command.loop(async () => {
    const name = await command.input('Enter the new topic name identifier')

    if (name === null) {
      return command.loop.END
    }

    if (name === '') {
      return command.loop.REPEAT
    }

    topic = await create({
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

    return command.loop.END
  })

  return topic
}

const manageTopic = async (topic: Topic) => {
  await command.loop(() => {
    log.inspect(topic.data)

    return command.loop.END
  })
}

const manageTopics = async () => {
  await command.loop(async () => {
    const action = await command.choice('Choose action', [
      'create a new topic',
      'edit a topic',
    ])

    switch (action) {
      case 'create a new topic': {
        const topic = await createNewTopic()

        if (!topic) return command.loop.REPEAT

        await manageTopic(topic)

        return command.loop.REPEAT
      }

      case 'edit a topic': {
        const topic = await findTopic()

        if (!topic) return command.loop.REPEAT

        await manageTopic(topic)

        return command.loop.REPEAT
      }

      case null:
        return command.loop.END
    }
  })
}

export default manageTopics
