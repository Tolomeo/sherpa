import type Topic from '../../../src/topic'
import type { TopicData } from '../../../types'
import { log, format } from '../../common'
import { loop, input, confirm, choice } from '../../common/command'
import { findResource } from '../resource'
import { findTopic } from './util'

type TopicBranding = Pick<TopicData, 'logo' | 'hero'>

const enterTopicBranding = async (branding: TopicBranding) => {
  const enteredBranding = { ...branding }

  const logo = await input(`Enter logo svg`, {
    answer: enteredBranding.logo ?? undefined,
  })

  if (logo) enteredBranding.logo = logo
  else if (logo === '') enteredBranding.logo = null

  const foreground = await input(`Enter foreground colour`, {
    answer: enteredBranding.hero?.foreground,
  })

  const background = await input(`Enter space separated background colours`, {
    answer: enteredBranding.hero?.background.join(' '),
  })

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

  await loop(async () => {
    const resource = await findResource()

    if (!resource) return loop.END

    const hasResource = await topic.hasResource(resource.id)

    if (hasResource) {
      log.error(
        `Resource ${resource.id} is already found in topic "${topic.name}"`,
      )
      return loop.REPEAT
    }

    if (
      !(await confirm(`Add resource ${resource.id} to topic "${topic.name}"?`))
    ) {
      log.error(`Insertion of resource aborted`)
      return loop.END
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

    return loop.END
  })
}

const update = async () => {
  const topic = await findTopic()

  if (!topic) return

  await loop(async () => {
    const action = await choice('Choose action', [
      'add resource',
      'update branding',
      'update notes',
    ])

    switch (action) {
      case 'add resource': {
        await addResource(topic)
        return loop.REPEAT
      }

      case 'update branding': {
        const branding = {
          logo: topic.data.logo,
          hero: topic.data.hero,
        }

        const brandingUpdate = await enterTopicBranding(branding)

        log.text(format.diff(branding, brandingUpdate))

        if (!(await confirm(`Confirm`))) return loop.REPEAT

        try {
          await topic.change(brandingUpdate)
          log.success(`Branding successfull updated`)
        } catch (err) {
          log.error(`Branding update failed`)
          log.error(err as string)
        }

        return loop.REPEAT
      }

      case 'update notes': {
        const noteUpdate = await input(`Enter notes`, {
          answer: topic.data.notes?.[0],
        })

        if (noteUpdate === null) return loop.REPEAT

        const notes: TopicData['notes'] =
          noteUpdate === '' ? null : [noteUpdate]

        log.text(format.diff(topic.data.notes, notes))

        if (!(await confirm(`Confirm`))) return loop.REPEAT

        try {
          await topic.change({ notes })
          log.success(`Notes successfull updated`)
        } catch (err) {
          log.error(`Notes update failed`)
          log.error(err as string)
        }

        return loop.REPEAT
      }

      case null:
        return loop.END
    }
  })
}

export default update
