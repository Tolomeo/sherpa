import helpers from '@metascraper/helpers'

const toDate = helpers.toRule(helpers.date)

const dateRules = () => {
  const documentDate = [toDate(($) => $('meta[name="date" i]').attr('content'))]

  const displayDate = [
    toDate(($) => $('time[datetime]').attr('datetime')),
    toDate(($) => helpers.$filter($, $('[class*="byline" i]'))),
    toDate(($) => helpers.$filter($, $('[id*="date" i]'))),
    toDate(($) => helpers.$filter($, $('[class*="date" i]'))),
    toDate(($) => helpers.$filter($, $('[class*="time" i]'))),
  ]

  return {
    documentDate,
    displayDate,
  }
}

const datePublishedRules = () => {
  const jsonldDatePublished = [
    toDate(helpers.$jsonld('datePublished')),
    toDate(helpers.$jsonld('dateCreated')),
  ]

  const openGraphDatePublished = [
    toDate(($) => $('meta[property*="published_time" i]').attr('content')),
  ]

  const microdataDatePublished = [
    toDate(($) => $('[itemprop="datepublished" i]').attr('content')),
    toDate(($) => $('[itemprop="datepublished" i]').attr('title')),
    toDate(($) => $('[itemprop="datecreated" i]').attr('content')),
    toDate(($) => $('[itemprop="datecreated" i]').attr('title')),
  ]

  const displayDatePublished = [
    toDate(($) => helpers.$filter($, $('[class*="publish" i]'))),
  ]

  return {
    jsonldDatePublished,
    openGraphDatePublished,
    microdataDatePublished,
    displayDatePublished,
  }
}

const dateModifiedRules = () => {
  const jsonldDateModified = [toDate(helpers.$jsonld('dateModified'))]

  const openGraphDateModified = [
    toDate(($) => $('meta[property*="modified_time" i]').attr('content')),
  ]

  const microdataDateModified = [
    toDate(($) => $('[itemprop*="datemodified" i]').attr('content')),
  ]

  return {
    jsonldDateModified,
    openGraphDateModified,
    microdataDateModified,
  }
}

module.exports = () => {
  const rules = {
    ...dateRules(),
    ...datePublishedRules(),
    ...dateModifiedRules(),
  }

  return rules
}
