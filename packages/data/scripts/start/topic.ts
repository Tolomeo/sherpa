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
  await command.loop(async () => {
    const action = await command.choice('Choose action', [
      'update brand logo',
      'update brand colours',
    ])

    switch (action) {
      case 'update brand logo': {
        const logo = await command.input(`Enter logo svg`)

        if (!logo) return command.loop.REPEAT

        try {
          await topic.change({ logo })
          log.success(`Logo successfull updated`)
        } catch (err) {
          log.error(`Logo update failed`)
          log.error(err as string)
        }

        return command.loop.REPEAT
      }
      case 'update brand colours': {
        const foreground = await command.input(`Enter foreground colour`, {
          answer: topic.data.hero?.foreground,
        })

        if (!foreground) return command.loop.REPEAT

        const background = await command.input(
          `Enter background colours (space separated)`,
          { answer: topic.data.hero?.background.join(' ') },
        )

        if (!background) return command.loop.REPEAT

        try {
          await topic.change({
            hero: {
              ...topic.data.hero,
              foreground,
              background: background.split(/ +/),
            },
          })
          log.success(`Brand background successfull updated`)
        } catch (err) {
          log.error(`Brand background update failed`)
          log.error(err as string)
        }

        return command.loop.REPEAT
      }
      case null:
        return command.loop.END
    }
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
