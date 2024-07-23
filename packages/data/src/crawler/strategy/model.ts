// import type { HealthCheckStrategy } from '../../../types'
import CrawlerStrategiesStore, {
  type HealthCheckStrategyDocument,
} from './store'

export const getByResourceId = async (resourceId: string) => {
  const doc = await CrawlerStrategiesStore.findOne({ resource: resourceId })

  if (doc) {
    return new CrawlerStrategy(doc)
  }

  return new CrawlerStrategy({
    _id: '',
    resource: resourceId,
    strategy: {
      runner: 'Http',
      config: {
        titleSelector: 'title:not(:empty)',
      },
    },
  })
}

class CrawlerStrategy {
  constructor(private document: HealthCheckStrategyDocument) {}

  public get resourceId() {
    return this.document.resource
  }

  public get data() {
    return this.document.strategy
  }
}
