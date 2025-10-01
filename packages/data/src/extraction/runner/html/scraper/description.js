import helpers from '@metascraper/helpers'

export default (opts) => {
  const toDescription = helpers.toRule(helpers.description, opts)

  const openGraphDescription = [
    toDescription(($) => $('meta[property="og:description"]').attr('content')),
  ]

  const twitterDescription = [
    toDescription(($) => $('meta[name="twitter:description"]').attr('content')),
    toDescription(($) =>
      $('meta[property="twitter:description"]').attr('content'),
    ),
  ]

  const documentDescription = [
    toDescription(($) => $('meta[name="description"]').attr('content')),
  ]

  const microdataDescription = [
    toDescription(($) => $('meta[itemprop="description"]').attr('content')),
  ]

  const jsonldDescription = [
    toDescription(helpers.$jsonld('articleBody')),
    toDescription(helpers.$jsonld('description')),
  ]

  const rules = {
    openGraphDescription,
    twitterDescription,
    documentDescription,
    microdataDescription,
    jsonldDescription,
  }

  return rules
}
