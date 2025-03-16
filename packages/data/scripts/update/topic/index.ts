import { create } from '../../../src/topic'
import type Topic from '../../../src/topic'
import type { TopicData } from '../../../types'
import { log, command, format } from '../../common'
import { findResource } from '../resource'
import { findTopic } from './common'

const addTopic = async () => {
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

const addResource = async (topic: Topic) => {
  log.lead(`Adding a resource to topic "${topic.name}"`)

  await command.loop(async () => {
    const resource = await findResource()

    if (!resource) return command.loop.END

    const hasResource = await topic.hasResource(resource.id)

    if (hasResource) {
      log.error(
        `Resource ${resource.id} is already found in topic "${topic.name}"`,
      )
      return command.loop.REPEAT
    }

    const resources = topic.data.resources
      ? [...topic.data.resources, resource.id]
      : [resource.id]

    try {
      await topic.change({
        resources,
      })
      log.lead(
        `Resource ${resource.id} successfully added to topic "${topic.name}"`,
      )
    } catch (err) {
      log.lead(`Topic "${topic.name}" update error`)
      log.error(err as string)
    }

    return command.loop.END
  })
}

const updateTopic = async (topic: Topic) => {
  await command.loop(async () => {
    const action = await command.choice('Choose action', [
      'add resource',
      'update branding',
      'update notes',
    ])

    switch (action) {
      case 'add resource': {
        await addResource(topic)
        return command.loop.REPEAT
      }

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

const main = async () => {
  await command.loop(async () => {
    const action = await command.choice('Choose action', [
      'create a new topic',
      'update a topic',
    ])

    switch (action) {
      case 'create a new topic': {
        const topic = await addTopic()

        if (!topic) return command.loop.REPEAT

        await updateTopic(topic)

        return command.loop.REPEAT
      }

      case 'update a topic': {
        const topic = await findTopic()

        if (!topic) return command.loop.REPEAT

        await updateTopic(topic)

        return command.loop.REPEAT
      }

      case null:
        return command.loop.END
    }
  })
}

export default main
export * from './common'
