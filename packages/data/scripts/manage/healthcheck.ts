import Healthcheck from '../../src/healthcheck/runner'
import { log, command, util } from '../common'
import type { ResourceData, HealthcheckStrategy } from '../../types'
import { HealthCheckStrategies } from '../../types'

export const chooseHealthCheckStrategy = async () => {
  const healthcheck = await command.choice(
    `Choose a strategy`,
    Object.keys(HealthCheckStrategies),
  )

  if (!healthcheck) return null

  const strategy =
    HealthCheckStrategies[healthcheck as HealthcheckStrategy['runner']]

  return util.clone(strategy)
}

export const scrapeResourceData = async (
  url: ResourceData['url'],
  strategy: HealthcheckStrategy = util.clone(HealthCheckStrategies.Http),
) => {
  const healthcheckRunner = new Healthcheck()
  let data: { title: string; source: string } | undefined

  await command.loop(async ({ repeat, end }) => {
    const healthCheckResult = await healthcheckRunner.run(url, strategy)

    if (!healthCheckResult.success) {
      log.error(`Health check failed`)
      log.error(healthCheckResult.error.message)
      const retry = await command.confirm(`Retry?`)

      return retry ? repeat : end
    }

    const title = await command.choice(
      `Choose title`,
      Object.values(healthCheckResult.data) as Array<string>,
    )

    if (!title) {
      return end
    }

    const { hostname, pathname } = new URL(url)
    const sourceHostname = hostname.replace(/^www./, '')
    const source =
      sourceHostname === 'github.com'
        ? `${sourceHostname}/${pathname.split('/')[1]}`
        : sourceHostname

    data = { title, source }

    return end
  })

  await healthcheckRunner.teardown()

  return data
}
