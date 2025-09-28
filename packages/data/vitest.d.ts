/* eslint-disable @typescript-eslint/no-explicit-any -- see https://vitest.dev/guide/extending-matchers.html */
/* eslint-disable @typescript-eslint/no-empty-interface -- see https://vitest.dev/guide/extending-matchers.html */
import 'vitest'
import type { ExtractionResultData } from './src/extraction/schema'

interface CustomMatchers<R = unknown> {
  toMatchExtractedData: (extractionResult: ExtractionResultData) => R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
