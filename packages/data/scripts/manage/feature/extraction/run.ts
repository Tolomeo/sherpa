import { TopicDataSchema } from '../../../../types'
import type { TopicData } from '../../../../types'
import FeatureExtractionRunner from '../../../../src/feature/runner'
import type { FeatureExtractionData } from '../../../../src/feature/schema'
import { FeatureExtractionDataSchema } from '../../../../src/feature/schema'
import { getByName as getTopicByName } from '../../../../src/topic/model'
import { getAllById as getResourcesById } from '../../../../src/resource/model'
import { create as createFeatureExtraction } from '../../../../src/feature/model'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO create a global type utility
type Constructor<T> = new (...args: any[]) => T

export const args = {
  topics: (
    value: string[] | undefined,
    options: { validationError?: Constructor<Error> },
  ) => {
    if (!value) return undefined

    if (!value.length) return undefined

    for (const v of value) {
      const validation = TopicDataSchema.shape.name.safeParse(v)

      if (validation.error) {
        const ValidationError = options.validationError ?? Error
        const errors = validation.error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join(',')

        throw new ValidationError(`Trigger option invalid ${errors}`)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- future proof
    return value as Array<TopicData['name']>
  },
  trigger: (
    value: string,
    options: { validationError?: Constructor<Error> },
  ) => {
    const validation =
      FeatureExtractionDataSchema.shape.trigger.safeParse(value)

    if (validation.error) {
      const ValidationError = options.validationError ?? Error
      const errors = validation.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(',')

      throw new ValidationError(`Trigger option invalid ${errors}`)
    }

    return value as FeatureExtractionData['trigger']
  },
}

const run = async (
  trigger: FeatureExtractionData['trigger'],
  topics?: Array<TopicData['name']>,
) => {
	console.log(topics);
	
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
