import { getAllByName } from '../../../src/topic'
import type Topic from '../../../src/topic'
import { log, command } from '../../common'

export const findTopic = async () => {
  let topic: Topic | undefined

  await command.loop(async (control) => {
    const name = await command.input(
      `Search topic - Enter topic name to look for`,
    )

    if (!name) return control.end

    const topics = await getAllByName(name)

    if (!topics.length) {
      log.warning(`No results found`)
      return control.repeat
    }

    if (topics.length === 1) {
      topic = topics[0]
      return control.end
    }

    const action = await command.choice(
      `Select topic`,
      topics.map((t) => t.name),
    )

    if (!action) control.repeat

    topic = topics.find((t) => t.name === action)

    return control.end
  })

  return topic
}
