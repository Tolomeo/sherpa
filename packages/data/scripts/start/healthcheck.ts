import Healthcheck from '../../src/healthcheck/runner'
import { log, command, util } from '../common'
import type { ResourceData, HealthcheckStrategy } from '../../types'
import { HealthCheckStrategies } from '../../types'
import { ScrapeResult } from '../../src/healthcheck/runner/common'

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

export const scrapeResourceTitle = async (
  url: ResourceData['url'],
  strategy: HealthcheckStrategy = util.clone(HealthCheckStrategies.Http),
) => {
  const healthcheckRunner = new Healthcheck()
  let title: string | undefined

  await command.loop(async () => {
    const healthCheckResult = await healthcheckRunner.run(url, strategy)

    if (!healthCheckResult.success) {
      log.error(`Health check failed`)
      log.error(healthCheckResult.error.message)
      const retry = await command.confirm(`Retry?`)

      return retry ? command.loop.REPEAT : command.loop.END
    }

    const titleSource = await command.choice(
      `Choose title`,
      Object.keys(healthCheckResult.data) as Array<keyof ScrapeResult>,
    )

    if (!titleSource) {
      return command.loop.END
    }

    title = healthCheckResult.data[titleSource]

    return command.loop.END
  })

  await healthcheckRunner.teardown()

  return title
}
