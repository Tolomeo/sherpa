import { create } from '../../../src/topic'
import { log } from '../../common'
import { loop, input } from '../../common/command'

const add = async () => {
  await loop(async () => {
    const topicName = await input('Enter the new topic name identifier').then(
      (enteredName) => (enteredName ? enteredName : null),
    )

    if (!topicName) {
      return loop.END
    }

    try {
      await create({
        name: topicName,
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
      log.success(`Topic ${topicName} created successfully`)
    } catch (err) {
      log.error(`Error creating "${topicName}" topic`)
      log.error(err as string)
    }

    return loop.END
  })
}

export default add
