// import { getAllByResourceId } from '../../../src/topic'
import { create as createResource } from '../../../src/resource'
// import type Resource from '../../../src/resource'
import { format, log, command } from '../../common'
// import { scrapeResourceTitle, chooseHealthCheckStrategy } from '../healthcheck'
import { loop } from '../../common/command'
import { enterResource } from './common'

const add = async () => {
  await loop(async () => {
    const url = await command.input(`Enter resource url`)

    if (!url) return loop.END

    const data = await enterResource(url)

    if (!data) {
      return loop.REPEAT
    }

    log.success(format.stringify(data))

    const confirm = await command.confirm(`Persist resource?`)

    if (!confirm) {
      log.error(`Resource creation aborted`)
      return loop.END
    }

    try {
      const resource = await createResource(data)
      log.success(`Resource ${resource.id} successfully created`)
    } catch (err) {
      log.error(`Error creating resource "${url}"`)
      log.error(err as string)
    }

    return loop.END
  })
}

export default add
