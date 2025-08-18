// This file is js instead of ts because metascraper is not coded in TS, it just offers .d.ts definition files
// This is a modified version of metascraper-title which prioritises <title/> over other rules
import {
  $jsonld,
  $filter,
  title as formatTitle,
  toRule as createRule,
} from '@metascraper/helpers'
import he from 'he'

const removeEntities = (str) => {
  const entities = {
    '&#xAD;': '',
  }
  const eEntities = new RegExp(Object.keys(entities).join('|'), 'g')

  return he.decode(
    he.encode(str).replace(eEntities, (entity) => entities[entity]),
  )
}

const condenseWhitespace = (str) => str.trim().replace(/\s{2,}/gu, ' ')

const getTitleElementText = ($el) =>
  removeEntities(condenseWhitespace($el.text()))

const createTitleRule = createRule(formatTitle)

export default () => {
  const documentTitle = [createTitleRule(($) => $filter($, $('title')))]

  const displayTitle = [
    createTitleRule(($) => $filter($, $('.post-title'), getTitleElementText)),
    createTitleRule(($) => $filter($, $('.entry-title'), getTitleElementText)),
    createTitleRule(($) =>
      $filter($, $('h1[class*="title" i] a'), getTitleElementText),
    ),
    createTitleRule(($) =>
      $filter($, $('h1[class*="title" i]'), getTitleElementText),
    ),
    createTitleRule(($) => $filter($, $('h1'), getTitleElementText)),
  ]

  const ogTitle = [
    createTitleRule(($) => $('meta[property="og:title"]').attr('content')),
  ]

  const twitterTitle = [
    createTitleRule(($) => $('meta[name="twitter:title"]').attr('content')),
    createTitleRule(($) => $('meta[property="twitter:title"]').attr('content')),
  ]

  const jsonldTitle = [createTitleRule($jsonld('headline'))]

  return {
    document: documentTitle,
    display: displayTitle,
    og: ogTitle,
    twitter: twitterTitle,
    jsonld: jsonldTitle,
  }
}
