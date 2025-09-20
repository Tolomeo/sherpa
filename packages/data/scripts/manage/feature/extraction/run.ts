import { InvalidOptionError } from '../../../common/command'
import FeatureExtractionRunner from '../../../../src/feature/runner'
import type { FeatureExtractionData } from '../../../../src/feature/schema'
import { FeatureExtractionDataSchema } from '../../../../src/feature/schema'
import { getByName as getTopicByName } from '../../../../src/topic/model'
import { getAllById as getResourcesById } from '../../../../src/resource/model'
import { create as createFeatureExtraction } from '../../../../src/feature/model'

export const cliOption = {
  trigger: (value: string) => {
    const validation =
      FeatureExtractionDataSchema.shape.trigger.safeParse(value)

    if (validation.error) {
      const errors = validation.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(',')
      throw new InvalidOptionError(`Trigger option invalid ${errors}`)
    }

    return value as FeatureExtractionData['trigger']
  },
}

const run = async (trigger: FeatureExtractionData['trigger']) => {
  const topic = await getTopicByName('htmlcss')

  if (!topic) throw new Error(`Topic not found`)

  const resourceIds = await topic.getResources()
  const resources = await getResourcesById(...resourceIds)

  const featureExtractionRun = await createFeatureExtraction({
    trigger,
    date: new Date(),
  })

  const featureExtractionRunner = new FeatureExtractionRunner()

  const results = await Promise.all(
    resources.map((resource) => {
      return featureExtractionRunner.run(resource.url, resource.healthcheck)
    }),
  )

  await featureExtractionRun.setResults(results)

  await featureExtractionRunner.teardown()
}

export default run
