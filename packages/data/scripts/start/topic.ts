import os from 'node:os'
import filesystem from 'node:fs/promises'
import path from 'node:path'
import { create as createTopic, getAllByName } from '../../src/topic'
import type Topic from '../../src/topic'
import { create as createResource } from '../../src/resource'
import { util, log, command, format } from '../common'
import type { ResourceData, ResourceType } from '../../types'
import { ResourceDataSchema } from '../../types'

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
      log.error(err as string)
      return command.loop.REPEAT
    }

    return command.loop.END
  })

  return urls
}

const populateResourceData = async (
  data: Pick<ResourceData, 'url'> & Partial<Omit<ResourceData, 'url'>>,
) => {
  const populatedData = { ...data }

  await command.loop(async () => {
    log.lead(`Enter resources data for url ${populatedData.url}`)

    const title = await command.input(`Title`, { answer: populatedData.title })

    if (title) populatedData.title = title

    const type = await command.choice('Type', [
      'basics',
      'advanced',
      'how-to',
      'curiosity',
      'tool',
      'reference',
      'feed',
    ] as ResourceType[])

    if (type) populatedData.type = type

    const source = await command.input('Source', {
      answer: populatedData.source,
    })

    if (source) populatedData.source = source
    else
      populatedData.source = new URL(populatedData.url).hostname.replace(
        /^www./,
        '',
      )

    const validation = ResourceDataSchema.safeParse(populatedData)

    if (!validation.success) {
      log.error('Invalid resource data entered')
      log.error(format.stringify(validation.error))
      return command.loop.REPEAT
    }

    log.text(format.diff(data, populatedData))

    const confirm = await command.confirm(`Confirm data for ${data.url}`)

    if (confirm) {
      return command.loop.END
    }

    return command.loop.REPEAT
  })

  return populatedData as ResourceData
}

const importResourceData = async (url: string) => {
  let data: ResourceData | undefined

  await command.loop(async () => {
    log.lead(`Importing ${url} data`)
    const action = await command.choice('Choose action', ['open', 'populate'])

    switch (action) {
      case 'open':
        await util.open(url)
        return command.loop.REPEAT

      case 'populate': {
        data = await populateResourceData({ url, ...data })
        return command.loop.END
      }

      case null:
        data = undefined
        return command.loop.END
    }
  })

  return data
}

const importResources = async (topic: Topic) => {
  const urls = await getBulkUrls()

  if (!urls) return

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]

    await command.loop(async () => {
      log.lead(
        `Importing resource ${i + 1} of ${urls.length} to "${
          topic.name
        }" topic`,
      )

      const data = await importResourceData(url)

      if (!data) {
        const skip = await command.confirm(`Skip importing ${url}?`)
        return skip ? command.loop.END : command.loop.REPEAT
      }

      try {
        const resource = await createResource(data)
        log.success(`Resource ${resource.id} successfully created`)
        const topicResources = topic.data.resources ?? []
        await topic.change({
          resources: [...topicResources, resource.id],
        })
        log.success(
          `Resource ${resource.id} successfully added to ${topic.name} resources`,
        )
      } catch (err) {
        log.error(`Error importing ${url}`)
        log.error(err as string)
        return command.loop.REPEAT
      }

      return command.loop.END
    })
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

    topic = await createTopic({
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
