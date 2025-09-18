import FeatureExtraction from '../../src/feature/runner'
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
  const featureExtraction = new FeatureExtraction()
  let data: { title: string; source: string } | undefined

  await command.loop(async ({ repeat, end }) => {
    const result = await featureExtraction.run(url, strategy)

    if (!result.success) {
      log.error(`Health check failed`)
      log.error(result.error)
      const retry = await command.confirm(`Retry?`)

      return retry ? repeat : end
    }

    let title

    switch (result.detail.source) {
      case 'PdfFile':
        title = result.detail.metadata.title
        break
      case 'Html': {
        const titles = Object.values(result.detail.metadata.title).filter(
          (t) => t !== null,
        )

        if (!titles.length) {
          log.error(`No available titles found`)
          break
        }

        title = await command.choice(`Choose title`, titles)
        break
      }
      case 'YoutubeDataAPIV3':
        title = result.detail.metadata.title
        break
      case 'UdemyAffiliateAPI':
        title = result.detail.metadata.title
    }

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

  await featureExtraction.teardown()

  return data
}
