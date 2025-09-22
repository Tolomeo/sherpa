import { TopicDataSchema } from '../../../../types'
import type { TopicData } from '../../../../types'
import FeatureExtractionRunner from '../../../../src/feature/runner'
import type { FeatureExtractionData } from '../../../../src/feature/schema'
import { FeatureExtractionDataSchema } from '../../../../src/feature/schema'
import {
  getByNames as getTopicsByNames,
  getParents as getAllParentTopics,
} from '../../../../src/topic/model'
import { getAllById as getResourcesById } from '../../../../src/resource/model'
import { create as createFeatureExtraction } from '../../../../src/feature/model'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO create a global type utility
type Constructor<T> = new (...args: any[]) => T

const run = async (
  trigger: FeatureExtractionData['trigger'],
  topicNames?: Array<TopicData['name']>,
) => {
  const topics = topicNames
    ? await getTopicsByNames(topicNames)
    : await getAllParentTopics()
  const featureExtractionRun = await createFeatureExtraction({
    trigger,
    date: new Date(),
  })
  const featureExtractionRunner = new FeatureExtractionRunner()

  for (const topic of topics) {
    const resourceIds = await topic.getResources()
    const resources = await getResourcesById(...resourceIds)

    const results = await Promise.all(
      resources.map((resource) => {
        return featureExtractionRunner.run(resource.url, resource.healthcheck)
      }),
    )

    await featureExtractionRun.setResults(results)
  }

  await featureExtractionRunner.teardown()
}

run.args = {
  topics: (
    values: string[] | undefined,
    options: { validationError?: Constructor<Error> } = {},
  ) => {
    if (!values) return undefined

    if (!values.length) return undefined

    for (const value of values) {
      const validation = TopicDataSchema.shape.name.safeParse(value)

      if (validation.error) {
        const ValidationError = options.validationError ?? Error
        const errors = validation.error.issues
          .map((issue) => {
            if (issue.path.length)
              return `${issue.path.join('.')}: ${issue.message}`

            return issue.message
          })
          .join(',')

        throw new ValidationError(`Trigger option invalid ${errors}`)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- future proof
    return values as Array<TopicData['name']>
  },
  trigger: (
    value: string,
    options: { validationError?: Constructor<Error> } = {},
  ) => {
    const validation =
      FeatureExtractionDataSchema.shape.trigger.safeParse(value)

    if (validation.error) {
      const ValidationError = options.validationError ?? Error
      const errors = validation.error.issues
        .map((issue) => {
          if (issue.path.length)
            return `${issue.path.join('.')}: ${issue.message}`

          return issue.message
        })
        .join(',')

      throw new ValidationError(`Trigger option invalid ${errors}`)
    }

    return value as FeatureExtractionData['trigger']
  },
}

export default run
