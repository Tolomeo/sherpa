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
import { createExtraction as createFeatureExtraction } from '../../../../src/feature/model'
import { log } from '../../../common'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO create a global type utility
type Constructor<T, A extends any[] = any[]> = new (...args: A) => T

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

  log.lead(
    `Extracting features for ${
      topicNames ? topicNames.join(',') : 'all'
    } topics`,
  )

  const extractedResources = new Set<string>()

  // NB: beware of nested loops
  for (const topic of topics) {
    log.lead(`Extracting features for "${topic.name}" topic`)

    const topicResourceIds = await topic.getResources()
    const resourceIds = topicResourceIds.filter(
      (r) => !extractedResources.has(r),
    )
    const resources = await getResourcesById(...resourceIds)

    const results = await featureExtractionRunner.runAll(resources)

    log.lead(`Saving features for "${topic.name}" topic`)

    await featureExtractionRun.setResults(results)

    resourceIds.forEach((r) => extractedResources.add(r))
  }

  await featureExtractionRunner.teardown()
}

run.args = {
  topics: (
    values: string[] | undefined,
    options: {
      validationError?: Constructor<Error, [string, ...unknown[]]>
    } = {},
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
          .join(', ')

        throw new ValidationError(`Topics value is invalid. ${errors}`)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- future proof
    return values as Array<TopicData['name']>
  },
  trigger: (
    value: string,
    options: {
      validationError?: Constructor<Error, [string, ...unknown[]]>
    } = {},
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
        .join(', ')

      throw new ValidationError(`Trigger value is invalid. ${errors}`)
    }

    return value as FeatureExtractionData['trigger']
  },
}

export default run
