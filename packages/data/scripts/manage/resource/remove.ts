import { getAllByResourceId } from '../../../src/topic'
import { format, log, command } from '../../common'
import { findResource } from './common'

const remove = async () => {
  const resource = await findResource()

  if (!resource) return

  const topics = await getAllByResourceId(resource.id)

  await command.loop(async (control) => {
    log.inspect(resource.document)
    log.warning(
      `The resource occurs in the following topics:\n${format.stringify(
        topics.map((t) => t.name),
      )}`,
    )

    const action = await command.choice(`Choose action`, [
      'display occurrences',
      'delete resource and update topics',
    ])

    switch (action) {
      case 'display occurrences':
        topics.forEach((t) => {
          const { name, main, resources } = t.data
          log.inspect(
            {
              name,
              main,
              resources,
            },
            {
              highlight: resource.id,
            },
          )
        })
        return control.repeat

      case 'delete resource and update topics': {
        const confirmed = await command.confirm(
          `Confirm resource ${resource.id} removal`,
        )

        if (!confirmed) return control.repeat

        try {
          await Promise.all(
            topics.map((topic) => {
              const main = topic.data.main
                ? topic.data.main.filter((id) => id !== resource.id)
                : null
              const resources = topic.data.resources
                ? topic.data.resources.filter((id) => id !== resource.id)
                : null

              return topic.change({
                main,
                resources,
              })
            }),
          )
          log.success(`Topics updated`)
        } catch (err) {
          log.error(`Error updating topics`)
          log.error(err as string)
        }

        try {
          await resource.delete()
          log.success(`Resource removed`)
        } catch (err) {
          log.error(`Error removing resource`)
          log.error(err as string)
        }

        return control.end
      }

      case null:
        return control.end
    }
  })
}

export default remove
