import { TopicDataSchema } from '../../../../types'
import type { TopicData } from '../../../../types'
import FeatureExtractionRunner from '../../../../src/feature/runner'
import type { FeatureExtractionData } from '../../../../src/feature/schema'
import { FeatureExtractionDataSchema } from '../../../../src/feature/schema'
import { getAll as getAllResources } from '../../../../src/resource/model'
import { createExtraction as createFeatureExtraction } from '../../../../src/feature/model'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO create a global type utility
type Constructor<T, A extends any[] = any[]> = new (...args: A) => T

const run = async (trigger: FeatureExtractionData['trigger']) => {
  const featureExtractionRun = await createFeatureExtraction({
    trigger,
    date: new Date(),
  })

  const featureExtractionRunner = new FeatureExtractionRunner()

  const resources = await getAllResources()

  const results = await featureExtractionRunner.runAll(resources)

  await featureExtractionRun.setResults(results)

  await featureExtractionRunner.teardown()
}

run.args = {
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
