import type Topic from '../../../src/topic'
import type { TopicData } from '../../../types'
import { log, format, command } from '../../common'
import { findResource } from '../resource'
import { findTopic } from './common'

type TopicBranding = Pick<TopicData, 'logo' | 'hero'>

const enterTopicBranding = async (branding: TopicBranding) => {
  const enteredBranding = { ...branding }

  const logo = await command.input(`Enter logo svg`, {
    initial: enteredBranding.logo ?? undefined,
  })

  if (logo) enteredBranding.logo = logo
  else if (logo === '') enteredBranding.logo = null

  const foreground = await command.input(`Enter foreground colour`, {
    initial: enteredBranding.hero?.foreground,
  })

  const background = await command.input(
    `Enter space separated background colours`,
    {
      initial: enteredBranding.hero?.background.join(' '),
    },
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

  await command.loop(async (control) => {
    const resource = await findResource()

    if (!resource) return control.end

    const hasResource = await topic.hasResource(resource.id)

    if (hasResource) {
      log.error(
        `Resource ${resource.id} is already found in topic "${topic.name}"`,
      )
      return control.repeat
    }

    if (
      !(await command.confirm(
        `Add resource ${resource.id} to topic "${topic.name}"?`,
      ))
    ) {
      log.error(`Insertion of resource aborted`)
      return control.end
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

    return control.end
  })
}

const update = async () => {
  const topic = await findTopic()

  if (!topic) return

  await command.loop(async (control) => {
    const action = await command.choice('Choose action', [
      'add resource',
      'update branding',
      'update notes',
    ])

    switch (action) {
      case 'add resource': {
        await addResource(topic)
        return control.repeat
      }

      case 'update branding': {
        const branding = {
          logo: topic.data.logo,
          hero: topic.data.hero,
        }

        const brandingUpdate = await enterTopicBranding(branding)

        log.text(format.diff(branding, brandingUpdate))

        if (!(await command.confirm(`Confirm`))) return control.repeat

        try {
          await topic.change(brandingUpdate)
          log.success(`Branding successfull updated`)
        } catch (err) {
          log.error(`Branding update failed`)
          log.error(err as string)
        }

        return control.repeat
      }

      case 'update notes': {
        const noteUpdate = await command.input(`Enter notes`, {
          initial: topic.data.notes?.[0],
        })

        if (noteUpdate === null) return control.repeat

        const notes: TopicData['notes'] =
          noteUpdate === '' ? null : [noteUpdate]

        log.text(format.diff(topic.data.notes, notes))

        if (!(await command.confirm(`Confirm`))) return control.repeat

        try {
          await topic.change({ notes })
          log.success(`Notes successfull updated`)
        } catch (err) {
          log.error(`Notes update failed`)
          log.error(err as string)
        }

        return control.repeat
      }

      case null:
        return control.end
    }
  })
}

export default update
