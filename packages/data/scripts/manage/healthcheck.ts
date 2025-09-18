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

    let title: string | null = null
    let source: string | null = null

    switch (result.detail.source) {
      case 'PdfFile': {
        title = result.detail.metadata.title

        if (result.detail.metadata.publisher) {
          source = await command.choice(
            `Choose source`,
            result.detail.metadata.publisher,
          )
        }

        break
      }
      case 'Html': {
        const titles = Object.values(result.detail.metadata.title).filter(
          (t) => t !== null,
        )

        if (titles.length) {
          title = await command.choice(`Choose title`, titles)
        }

        const publishers = Object.values(
          result.detail.metadata.publisher,
        ).filter((p) => p !== null)

        if (publishers.length) {
          source = await command.choice(`Choose source`, publishers)
        }

        break
      }
      case 'YoutubeDataAPIV3':
        title = result.detail.metadata.title
        source = result.detail.metadata.publisher
        break
      case 'UdemyAffiliateAPI':
        title = result.detail.metadata.title
        source = result.detail.metadata.publisher
    }

    if (!title) {
      return end
    }

    if (!source) {
      const { hostname, pathname } = new URL(url)
      const sourceHostname = hostname.replace(/^www./, '')
      source =
        sourceHostname === 'github.com'
          ? `${sourceHostname}/${pathname.split('/')[1]}`
          : sourceHostname
    }

    data = { title, source }

    return end
  })

  await featureExtraction.teardown()

  return data
}
