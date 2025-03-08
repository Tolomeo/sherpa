import { expect } from 'vitest'

expect.extend({
  toBeValidScrapeResultForTitle(received, title) {
    const titleSources = [
      'title',
      'documentTitle',
      'metadataTitle',
      'displayTitle',
    ]

    if (titleSources.every((titleSource) => !(titleSource in received))) {
      throw new Error(`Received value is not a valid scrape result`)
    }

    const matchingValues = titleSources.filter((titleSource) => {
      const receivedValue = received[titleSource]

      if (typeof receivedValue !== 'string') {
        return false
      }

      return receivedValue.includes(title)
    })

    const pass = matchingValues.length > 0
    const message = () =>
      pass
        ? [
            `Expected title ${this.utils.printExpected(title)} was found in scrape results in`,
            this.utils.stringify(matchingValues),
          ].join('\n')
        : [
            `Expected title ${this.utils.printExpected(title)} was not found in scrape results`,
            this.utils.printDiffOrStringify(received, title),
          ].join('\n')

    return {
      pass,
      message,
    }
  },
})
