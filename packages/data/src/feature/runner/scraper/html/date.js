import helpers from '@metascraper/helpers'

const toDate = helpers.toRule(helpers.date)

export default () => {
  const documentDate = [toDate(($) => $('meta[name="date" i]').attr('content'))]

  const displayDate = [
    toDate(($) => $('time[datetime]').attr('datetime')),
    toDate(($) => helpers.$filter($, $('[class*="byline" i]'))),
    toDate(($) => helpers.$filter($, $('[id*="date" i]'))),
    toDate(($) => helpers.$filter($, $('[class*="date" i]'))),
    toDate(($) => helpers.$filter($, $('[class*="time" i]'))),
  ]

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

  const jsonldDateModified = [toDate(helpers.$jsonld('dateModified'))]

  const openGraphDateModified = [
    toDate(($) => $('meta[property*="modified_time" i]').attr('content')),
  ]

  const microdataDateModified = [
    toDate(($) => $('[itemprop*="datemodified" i]').attr('content')),
  ]

  const rules = {
    documentDate,
    displayDate,

    jsonldDatePublished,
    openGraphDatePublished,
    microdataDatePublished,
    displayDatePublished,

    jsonldDateModified,
    openGraphDateModified,
    microdataDateModified,
  }

  return rules
}
