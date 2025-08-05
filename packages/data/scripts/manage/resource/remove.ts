import { getAllByResourceId } from '../../../src/topic'
import { format, log } from '../../common'
import { loop, confirm, choice } from '../../common/command'
import { findResource } from './common'

const remove = async () => {
  const resource = await findResource()

  if (!resource) return

  const topics = await getAllByResourceId(resource.id)

  await loop(async () => {
    log.inspect(resource.document)
    log.warning(
      `The resource occurs in the following topics:\n${format.stringify(
        topics.map((t) => t.name),
      )}`,
    )

    const action = await choice(`Choose action`, [
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
        return loop.REPEAT

      case 'delete resource and update topics': {
        const confirmed = await confirm(
          `Confirm resource ${resource.id} removal`,
        )

        if (!confirmed) return loop.REPEAT

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

        return loop.END
      }

      case null:
        return loop.END
    }
  })
}

export default remove
