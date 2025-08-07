import { create as createResource } from '../../../src/resource'
import { format, log, command } from '../../common'
import { loop } from '../../common/command'
import { enterResource } from './common'

const add = async () => {
  await loop(async (control) => {
    const url = await command.input(`Enter resource url`)

    if (!url) return control.end

    const data = await enterResource(url)

    if (!data) {
      return control.repeat
    }

    log.success(format.stringify(data))

    const confirm = await command.confirm(`Persist resource?`)

    if (!confirm) {
      log.error(`Resource creation aborted`)
      return control.end
    }

    try {
      const resource = await createResource(data)
      log.success(`Resource ${resource.id} successfully created`)
    } catch (err) {
      log.error(`Error creating resource "${url}"`)
      log.error(err as string)
    }

    return control.end
  })
}

export default add
