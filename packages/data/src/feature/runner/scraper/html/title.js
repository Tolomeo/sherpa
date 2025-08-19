// This file is js instead of ts because metascraper is not coded in TS, it just offers .d.ts definition files
// This is a modified version of metascraper-title which prioritises <title/> over other rules
import {
  $jsonld,
  $filter,
  title,
  toRule as createRule,
} from '@metascraper/helpers'
import he from 'he'

const filterEntities = (str) => {
  const entities = {
    '&#xAD;': '',
  }
  const eEntities = new RegExp(Object.keys(entities).join('|'), 'g')

  return he.decode(
    he.encode(str).replace(eEntities, (entity) => entities[entity]),
  )
}

const mapTitle = createRule((value, ...args) => {
  const titleText = title(value, ...args)

  if (!titleText) return

  return filterEntities(titleText)
})

export default () => {
  const documentTitle = [mapTitle(($) => $filter($, $('title')))]

  const displayTitle = [
    mapTitle(($) => $filter($, $('.post-title'))),
    mapTitle(($) => $filter($, $('.entry-title'))),
    mapTitle(($) => $filter($, $('h1[class*="title" i] a'))),
    mapTitle(($) => $filter($, $('h1[class*="title" i]'))),
    mapTitle(($) => $filter($, $('h1'))),
  ]

  const ogTitle = [
    mapTitle(($) => $('meta[property="og:title"]').attr('content')),
  ]

  const twitterTitle = [
    mapTitle(($) => $('meta[name="twitter:title"]').attr('content')),
    mapTitle(($) => $('meta[property="twitter:title"]').attr('content')),
  ]

  const jsonldTitle = [mapTitle($jsonld('headline'))]

  return {
    document: documentTitle,
    display: displayTitle,
    og: ogTitle,
    twitter: twitterTitle,
    jsonld: jsonldTitle,
  }
}
