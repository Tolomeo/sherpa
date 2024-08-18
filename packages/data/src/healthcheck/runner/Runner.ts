import { randomUUID } from 'node:crypto'
import type { HealthcheckStrategy } from '../../../types/healthcheck'
import PdfFileHealthCheckRunner from './PdfFileRunner'
import HttpHealthCheckRunner from './HttpRunner'
import E2EHealthCheckRunner from './E2ERunner'
import ZenscrapeHealthCheckRunner from './ZenscrapeRunner'
import YoutubeDataApiHealthCheckRunner from './YoutubeDataApiRunner'
import UdemyAffiliateApiHealthCheckRunner from './UdemyAffiliateApiRunner'
import { type Constructor, RequestQueue } from './common'

type HealthCheckRunners =
  | PdfFileHealthCheckRunner
  | HttpHealthCheckRunner
  | E2EHealthCheckRunner
  | ZenscrapeHealthCheckRunner
  | YoutubeDataApiHealthCheckRunner
  | UdemyAffiliateApiHealthCheckRunner

class HealthCheck {
  private runners = new Map<
    Constructor<HealthCheckRunners>,
    HealthCheckRunners
  >()

  async getRunner<R extends HealthCheckRunners>(
    Runner: Constructor<R>,
  ): Promise<R> {
    const runner = this.runners.get(Runner)

    if (runner) return runner as R

    const requestQueue = await RequestQueue.open(randomUUID())
    const runnerInstance = new Runner({ requestQueue })
    this.runners.set(Runner, runnerInstance)
    return runnerInstance
  }

  async run(url: string, strategy: HealthcheckStrategy) {
    let runner: HealthCheckRunners

    switch (strategy.runner) {
      case 'PdfFile':
        runner = await this.getRunner(PdfFileHealthCheckRunner)
        return runner.run(url, {})
      case 'Http':
        runner = await this.getRunner(HttpHealthCheckRunner)
        return runner.run(url, strategy.config)
      case 'E2E':
        runner = await this.getRunner(E2EHealthCheckRunner)
        return runner.run(url, strategy.config)
      case 'YoutubeData':
        runner = await this.getRunner(YoutubeDataApiHealthCheckRunner)
        return runner.run(url, {})
      case 'Zenscrape':
        runner = await this.getRunner(ZenscrapeHealthCheckRunner)
        return runner.run(url, strategy.config)
      case 'UdemyAffiliate':
        runner = await this.getRunner(UdemyAffiliateApiHealthCheckRunner)
        return runner.run(url, {})
    }
  }

  async teardown() {
    const runnersTeardown = Object.values(this.runners).map(
      (runner: HealthCheckRunners) => runner.teardown(),
    )
    await Promise.all(runnersTeardown)

    this.runners.clear()
  }
}

export default HealthCheck
