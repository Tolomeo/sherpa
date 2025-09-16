import helpers from '@metascraper/helpers'

const REGEX_TITLE = /^.*?[-|]\s+(.*)$/

const toPublisher = helpers.toRule(helpers.publisher)

const getFromTitle = (text, regex = REGEX_TITLE) => {
  const matches = regex.exec(text)
  if (!matches) return false
  let result = matches[1]
  while (regex.test(result)) result = regex.exec(result)[1]
  return result
}

export default () => {
  const jsonldPublisher = [toPublisher(helpers.$jsonld('publisher.name'))]

  const openGraphPublisher = [
    toPublisher(($) => $('meta[property="og:site_name"]').attr('content')),
    toPublisher(($) => $('meta[property*="app_name" i]').attr('content')),
  ]

  const documentPublisher = [
    toPublisher(($) => $('meta[name*="application-name" i]').attr('content')),
    toPublisher(($) => $('meta[name*="app-title" i]').attr('content')),
    toPublisher(($) => $('meta[name="publisher" i]').attr('content')),
  ]

  const twitterPublisher = [
    toPublisher(($) =>
      $('meta[name="twitter:app:name:iphone"]').attr('content'),
    ),
    toPublisher(($) =>
      $('meta[property="twitter:app:name:iphone"]').attr('content'),
    ),
    toPublisher(($) => $('meta[name="twitter:app:name:ipad"]').attr('content')),
    toPublisher(($) =>
      $('meta[property="twitter:app:name:ipad"]').attr('content'),
    ),
    toPublisher(($) =>
      $('meta[name="twitter:app:name:googleplay"]').attr('content'),
    ),
    toPublisher(($) =>
      $('meta[property="twitter:app:name:googleplay"]').attr('content'),
    ),
  ]

  const displayPublisher = [
    toPublisher(($) => helpers.$filter($, $('#logo'))),
    toPublisher(($) => helpers.$filter($, $('.logo'))),
    toPublisher(($) => helpers.$filter($, $('a[class*="brand" i]'))),
    toPublisher(($) => $('[class*="logo" i] a img[alt]').attr('alt')),
    toPublisher(($) => $('[class*="logo" i] img[alt]').attr('alt')),
    toPublisher(($) =>
      helpers.$filter($, $('title'), (el) =>
        getFromTitle(helpers.$filter.fn(el)),
      ),
    ),
  ]

  const domainPublisher = [toPublisher((_, url) => new URL(url).hostname)]

  const rules = {
    jsonldPublisher,
    documentPublisher,
    openGraphPublisher,
    twitterPublisher,
    displayPublisher,
    domainPublisher,
  }

  return rules
}
