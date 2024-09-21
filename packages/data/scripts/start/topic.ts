import os from 'node:os'
import filesystem from 'node:fs/promises'
import path from 'node:path'
import { create, getAllByName } from '../../src/topic'
import type Topic from '../../src/topic'
import { util, log, command } from '../common'

const getBulkUrls = async () => {
  let urls: string[] | undefined

  await command.loop(async () => {
    let file = await command.input('Enter file source path (.md)')

    if (file === null) {
      return command.loop.END
    }

    file = file.replace(/^~/, os.homedir())
    file = path.resolve(file)

    try {
      const filecontent = await filesystem.readFile(file, {
        encoding: 'utf8',
      })

      urls = filecontent.split('\n').reduce<string[]>((_urls, line) => {
        const match = /\[[^\]]+\]\(([^\]]+)\)/.exec(line)

        if (!match) return _urls

        _urls.push(match[1])

        return _urls
      }, [])

      log.success(`${urls.length} urls found in ${file}`)
    } catch (err) {
      log.error(err)
      return command.loop.REPEAT
    }

    return command.loop.END
  })

  return urls
}

const importResource = async (url: string) => {
  await command.loop(async () => {
    log.lead(`Importing ${url}`)
    const action = await command.choice('Choose action', ['open', 'skip'])

    switch (action) {
      case 'open':
        await util.open(url)
        return command.loop.REPEAT

      case 'skip':
        if (await command.confirm(`Discard this resource?`)) {
          return command.loop.END
        }
        return command.loop.REPEAT

      case null:
        return command.loop.REPEAT
    }
  })
}

const importResources = async (topic: Topic) => {
  log.lead(topic.name)

  const urls = await getBulkUrls()

  if (!urls) return

  for (const url of urls) {
    await importResource(url)
  }
}

const searchTopic = async () => {
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

const manageTopic = async (topic: Topic) => {
  await command.loop(async () => {
    log.inspect(topic.data)

    const action = await command.choice('Choose action', [
      'import bulk resources',
    ])

    switch (action) {
      case 'import bulk resources':
        await importResources(topic)
        return command.loop.REPEAT
      case null:
        return command.loop.END
    }
  })
}

const createTopic = async () => {
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

const manageTopics = async () => {
  await command.loop(async () => {
    const action = await command.choice('Choose action', [
      'create a new topic',
      'edit a topic',
    ])

    switch (action) {
      case 'create a new topic': {
        const topic = await createTopic()
        if (!topic) return command.loop.REPEAT
        await manageTopic(topic)
        return command.loop.REPEAT
      }

      case 'edit a topic': {
        const topic = await searchTopic()
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
