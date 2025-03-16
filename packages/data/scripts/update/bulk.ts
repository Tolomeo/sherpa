import os from 'node:os'
import filesystem from 'node:fs/promises'
import path from 'node:path'
import { type ResourceData, type HealthcheckStrategy } from '../../types'
import type Topic from '../../src/topic'
import {
  getByUrl as getResourceByUrl,
  create as createResource,
} from '../../src/resource'
import { log, command, util, format } from '../common'
import { findTopic } from './topic'
import { scrapeResourceTitle, chooseHealthCheckStrategy } from './healthcheck'
import { enterResourceData } from './resource'

const getImportUrls = async () => {
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

export const importResource = async (url: string) => {
  let data: ResourceData | undefined
  let healthcheck: HealthcheckStrategy | undefined

  await command.loop(async () => {
    log.lead(`Importing ${url} resource`)

    const title = await scrapeResourceTitle(url, healthcheck)

    if (!title) {
      log.warning(`Scraping failed with the default strategy`)

      const changeHealthcheck = await command.confirm(
        `Try with a different strategy?`,
      )

      if (changeHealthcheck) {
        healthcheck = (await chooseHealthCheckStrategy()) ?? undefined
        return command.loop.REPEAT
      }
    }

    const enteredData = await enterResourceData({
      ...data,
      url,
      title,
      healthcheck,
    })

    log.text(format.diff({ url, ...data }, enteredData))

    const action = await command.choice(`Data for ${url}`, [
      'Confirm data',
      'Change data',
    ])

    switch (action) {
      case 'Confirm data':
        data = enteredData
        return command.loop.END
      case 'Change data':
        data = enteredData
        return command.loop.REPEAT
      case null:
      default:
        return command.loop.END
    }
  })

  if (!data) return

  try {
    const resource = await createResource(data)
    log.success(`Resource ${resource.id} successfully created`)
    return resource
  } catch (err) {
    log.error(`Error importing ${url}`)
    log.error(err as string)
  }
}

const importTopicResources = async (topic: Topic) => {
  const urls = await getImportUrls()

  if (!urls) return

  const browser = await util.openBrowser()

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]

    await command.loop(async () => {
      log.lead(
        `Importing resource ${i + 1} of ${urls.length} to "${
          topic.name
        }" topic`,
      )

      const alreadyImportedResource = await getResourceByUrl(url)
      const alreadyImported =
        alreadyImportedResource &&
        (await topic.hasResource(alreadyImportedResource.id))

      if (alreadyImportedResource) {
        log.warning(`${url} already found among resources`)
      }

      if (alreadyImported) {
        log.warning(`Resource ${url} was already imported to ${topic.name}`)
        return command.loop.END
      }

      await browser.goTo(url)

      const importUrl = await command.confirm(`Import ${url} resource?`)

      if (!importUrl) {
        log.warning(`Skipping ${url} import`)
        return command.loop.END
      }

      const resource = alreadyImportedResource
        ? alreadyImportedResource
        : await importResource(url)

      if (!resource) {
        return command.loop.REPEAT
      }

      try {
        const topicResources = topic.data.resources ?? []
        await topic.change({
          resources: [...topicResources, resource.id],
        })
        log.success(
          `Resource ${resource.id} successfully added to ${topic.name} resources`,
        )
        return command.loop.END
      } catch (err) {
        log.error(`Error updating ${topic.name}`)
        log.error(err as string)
        return command.loop.REPEAT
      }
    })
  }

  await browser.close()
}

const selectBulkOperation = async () => {
  await command.loop(async () => {
    const action = await command.choice('Choose action', [
      'import bulk resources',
    ])

    switch (action) {
      case 'import bulk resources': {
        const topic = await findTopic()

        if (!topic) return command.loop.REPEAT

        await importTopicResources(topic)

        return command.loop.REPEAT
      }

      case null:
        return command.loop.END
    }
  })
}

export default selectBulkOperation
