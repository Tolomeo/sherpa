import { getAllByName } from '../../../src/topic'
import type Topic from '../../../src/topic'
import { log, command } from '../../common'
import { loop } from '../../common/loop'

export const findTopic = async () => {
  let topic: Topic | undefined

  await loop(async () => {
    const name = await command.input(
      `Search topic - Enter topic name to look for`,
    )

    if (!name) return loop.END

    const topics = await getAllByName(name)

    if (!topics.length) {
      log.warning(`No results found`)
      return loop.REPEAT
    }

    if (topics.length === 1) {
      topic = topics[0]
      return loop.END
    }

    const action = await command.choice(
      `Select topic`,
      topics.map((t) => t.name),
    )

    if (!action) loop.REPEAT

    topic = topics.find((t) => t.name === action)

    return loop.END
  })

  return topic
}
