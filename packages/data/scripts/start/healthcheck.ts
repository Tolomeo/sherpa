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

export const scrapeResourceTitle = async (
  url: ResourceData['url'],
  strategy?: HealthcheckStrategy,
) => {
  const healthcheckRunner = new Healthcheck()
  let title: string | undefined

  await command.loop(async () => {
    const healthCheckStrategy = strategy
      ? util.clone(strategy)
      : await chooseHealthCheckStrategy()

    if (!healthCheckStrategy) {
      log.error(`Cannot run healthcheck without a defined healthcheck strategy`)
      return command.loop.END
    }

    const healthCheckResult = await healthcheckRunner.run(
      url,
      healthCheckStrategy,
    )

    if (!healthCheckResult.success) {
      log.error(`Health check failed`)
      log.error(healthCheckResult.error.message)
      const retry = await command.confirm(`Retry?`)

      return retry ? command.loop.REPEAT : command.loop.END
    }

    title = healthCheckResult.data.title

    return command.loop.END
  })

  await healthcheckRunner.teardown()

  return title
}
