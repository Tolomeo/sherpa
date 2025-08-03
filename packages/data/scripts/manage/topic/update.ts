import { loop } from '../../common/command'
import { findTopic } from './common'

const update = async () => {
  await loop(async () => {
    const topic = await findTopic()

    if (!topic) return loop.REPEAT

    // await updateTopic(topic)

    return loop.REPEAT
  })
}

export default update
