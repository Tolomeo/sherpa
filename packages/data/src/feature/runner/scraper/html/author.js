import helpers from '@metascraper/helpers'

const REGEX_STRICT = /^\S+\s+\S+/

const toAuthor = helpers.toRule(helpers.author)

const strict = (rule) => ($) => {
  const value = rule($)
  return REGEX_STRICT.test(value) && value
}

export default () => {
  const jsonldAuthor = [
    toAuthor(helpers.$jsonld('author.name')),
    toAuthor(helpers.$jsonld('brand.name')),
  ]

  const documentAuthor = [
    toAuthor(($) => $('meta[name="author"]').attr('content')),
  ]

  const openGraphAuthor = [
    toAuthor(($) => $('meta[property="article:author"]').attr('content')),
  ]

  const microdataAuthor = [
    toAuthor(($) =>
      helpers.$filter($, $('[itemprop*="author" i] [itemprop="name"]')),
    ),
    toAuthor(($) => helpers.$filter($, $('[itemprop*="author" i]'))),
  ]

  const displayAuthor = [
    toAuthor(($) => helpers.$filter($, $('[rel="author"]'))),
    strict(toAuthor(($) => helpers.$filter($, $('a[class*="author" i]')))),
    strict(toAuthor(($) => helpers.$filter($, $('[class*="author" i] a')))),
    strict(toAuthor(($) => helpers.$filter($, $('a[href*="/author/" i]')))),
    toAuthor(($) => helpers.$filter($, $('a[class*="screenname" i]'))),
    strict(toAuthor(($) => helpers.$filter($, $('[class*="author" i]')))),
    strict(
      toAuthor(($) =>
        helpers.$filter($, $('[class*="byline" i]'), (el) => {
          const value = helpers.$filter.fn(el)
          return !helpers.date(value) && value
        }),
      ),
    ),
  ]

  const rules = {
    jsonldAuthor,
    documentAuthor,
    openGraphAuthor,
    microdataAuthor,
    displayAuthor,
  }

  return rules
}
