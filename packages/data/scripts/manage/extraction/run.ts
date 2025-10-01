import ExtractionRunner from '../../../src/extraction/runner'
import type { ExtractionData } from '../../../src/extraction/schema'
import { ExtractionDataSchema } from '../../../src/extraction/schema'
import { createExtraction as createFeatureExtraction } from '../../../src/extraction/model'
import { getAll as getAllResources } from '../../../src/resource/model'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO create a global type utility
type Constructor<T, A extends any[] = any[]> = new (...args: A) => T

const run = async (trigger: ExtractionData['trigger']) => {
  const extractionRun = await createFeatureExtraction({
    trigger,
    date: new Date(),
  })

  const extractionRunner = new ExtractionRunner()

  const resources = await getAllResources()

  const results = await extractionRunner.runAll(resources)

  await extractionRun.setResults(results)

  await extractionRunner.teardown()
}

run.args = {
  trigger: (
    value: string,
    options: {
      validationError?: Constructor<Error, [string, ...unknown[]]>
    } = {},
  ) => {
    const validation = ExtractionDataSchema.shape.trigger.safeParse(value)

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

    return value as ExtractionData['trigger']
  },
}

export default run
