// This file is js instead of ts because metascraper is not coded in TS, it just offers .d.ts definition files
// This is a modified version of metascraper-title which prioritises <title/> over other rules
import helpers from '@metascraper/helpers'
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

const mapTitle = helpers.toRule((value, ...args) => {
  const titleText = helpers.title(value, ...args)

  if (!titleText) return

  return filterEntities(titleText)
})

export default () => {
  const documentTitle = [mapTitle(($) => helpers.$filter($, $('title')))]

  const displayTitle = [
    mapTitle(($) => helpers.$filter($, $('.post-title'))),
    mapTitle(($) => helpers.$filter($, $('.entry-title'))),
    mapTitle(($) => helpers.$filter($, $('h1[class*="title" i] a'))),
    mapTitle(($) => helpers.$filter($, $('h1[class*="title" i]'))),
    mapTitle(($) => helpers.$filter($, $('h1'))),
  ]

  const ogTitle = [
    mapTitle(($) => $('meta[property="og:title"]').attr('content')),
  ]

  const twitterTitle = [
    mapTitle(($) => $('meta[name="twitter:title"]').attr('content')),
    mapTitle(($) => $('meta[property="twitter:title"]').attr('content')),
  ]

  const jsonldTitle = [mapTitle(helpers.$jsonld('headline'))]

  return {
    documentTitle,
    displayTitle,
    ogTitle,
    twitterTitle,
    jsonldTitle,
  }
}
