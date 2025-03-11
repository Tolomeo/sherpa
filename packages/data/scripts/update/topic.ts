import { create, getAllByName } from '../../src/topic'
import type Topic from '../../src/topic'
import type { TopicData } from '../../types'
import { log, command, format } from '../common'

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

type TopicBranding = Pick<TopicData, 'logo' | 'hero'>

const enterTopicBranding = async (branding: TopicBranding) => {
  const enteredBranding = { ...branding }

  const logo = await command.input(`Enter logo svg`, {
    answer: enteredBranding.logo ?? undefined,
  })

  if (logo) enteredBranding.logo = logo
  else if (logo === '') enteredBranding.logo = null

  const foreground = await command.input(`Enter foreground colour`, {
    answer: enteredBranding.hero?.foreground,
  })

  const background = await command.input(
    `Enter space separated background colours`,
    { answer: enteredBranding.hero?.background.join(' ') },
  )

  if (foreground && background) {
    enteredBranding.hero = {
      foreground,
      background: background.split(/ +/),
    }
  } else if (foreground === '' && background === '') enteredBranding.hero = null

  return enteredBranding
}

const manageTopic = async (topic: Topic) => {
  await command.loop(async () => {
    const action = await command.choice('Choose action', [
      'update branding',
      'update notes',
    ])

    switch (action) {
      case 'update branding': {
        const branding = {
          logo: topic.data.logo,
          hero: topic.data.hero,
        }

        const brandingUpdate = await enterTopicBranding(branding)

        log.text(format.diff(branding, brandingUpdate))
        const confirm = await command.confirm(`Confirm`)

        if (!confirm) return command.loop.REPEAT

        try {
          await topic.change(brandingUpdate)
          log.success(`Branding successfull updated`)
        } catch (err) {
          log.error(`Branding update failed`)
          log.error(err as string)
        }

        return command.loop.REPEAT
      }

      case 'update notes': {
        const noteUpdate = await command.input(`Enter notes`, {
          answer: topic.data.notes?.[0],
        })

        if (noteUpdate === null) return command.loop.REPEAT

        const notes: TopicData['notes'] =
          noteUpdate === '' ? null : [noteUpdate]

        log.text(format.diff(topic.data.notes, notes))
        const confirm = await command.confirm(`Confirm`)

        if (!confirm) return command.loop.REPEAT

        try {
          await topic.change({ notes })
          log.success(`Notes successfull updated`)
        } catch (err) {
          log.error(`Notes update failed`)
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
