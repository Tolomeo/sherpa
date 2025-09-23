import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { getLastExtraction } from '../src/feature/model'

describe('Feature extraction', async () => {
  const extraction = await getLastExtraction()

  test('eeeeh', () => {
    expect(extraction).not.toBeNull()
    console.log(extraction!.date)
    expect(extraction!.date).toBeInstanceOf(Date)
  })
})
