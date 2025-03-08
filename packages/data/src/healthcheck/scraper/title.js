// This file is js instead of ts because metascraper is not coded in TS, it just offers .d.ts definition files
// This is a modified version of metascraper-title which prioritises <title/> over other rules
import { $jsonld, $filter, title, toRule } from '@metascraper/helpers'

const toTitle = toRule(title)

export default () => {
  const documentTitle = [toTitle(($) => $filter($, $('title')))]
  const metadataTitle = [
    toTitle(($) => $('meta[property="og:title"]').attr('content')),
    toTitle(($) => $('meta[name="twitter:title"]').attr('content')),
    toTitle(($) => $('meta[property="twitter:title"]').attr('content')),
    toTitle($jsonld('headline')),
  ]
  const displayTitle = [
    toTitle(($) => $filter($, $('.post-title'))),
    toTitle(($) => $filter($, $('.entry-title'))),
    toTitle(($) => $filter($, $('h1[class*="title" i] a'))),
    toTitle(($) => $filter($, $('h1[class*="title" i]'))),
    toTitle(($) => $filter($, $('h1'))),
  ]
  const title = []
    .concat(documentTitle)
    .concat(metadataTitle)
    .concat(displayTitle)

  return {
    title,
    documentTitle,
    metadataTitle,
    displayTitle,
  }
}
