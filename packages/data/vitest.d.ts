/* eslint-disable @typescript-eslint/no-explicit-any -- see https://vitest.dev/guide/extending-matchers.html */
/* eslint-disable @typescript-eslint/no-empty-interface -- see https://vitest.dev/guide/extending-matchers.html */
import 'vitest'
import type { ExtractionResult } from './src/extraction/model'

interface CustomMatchers<R = unknown> {
  toBeHealthy: (extractionResult: ExtractionResult) => R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
