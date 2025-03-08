// This file is js instead of ts because metascraper is not coded in TS, it just offers .d.ts definition files
// This is a modified version of metascraper-title which prioritises <title/> over other rules
import { $jsonld, $filter, title, toRule } from '@metascraper/helpers'

const toTitle = toRule(title)

export default () => {
  const rules = {
    title: [
      toTitle(($) => $filter($, $('title'))),
      toTitle(($) => $('meta[property="og:title"]').attr('content')),
      toTitle(($) => $('meta[name="twitter:title"]').attr('content')),
      toTitle(($) => $('meta[property="twitter:title"]').attr('content')),
      toTitle($jsonld('headline')),
      toTitle(($) => $filter($, $('.post-title'))),
      toTitle(($) => $filter($, $('.entry-title'))),
      toTitle(($) => $filter($, $('h1[class*="title" i] a'))),
      toTitle(($) => $filter($, $('h1[class*="title" i]'))),
    ],
    documentTitle: [toTitle(($) => $filter($, $('title')))],
    metadataTitle: [
      toTitle(($) => $('meta[property="og:title"]').attr('content')),
      toTitle(($) => $('meta[name="twitter:title"]').attr('content')),
      toTitle(($) => $('meta[property="twitter:title"]').attr('content')),
      toTitle($jsonld('headline')),
    ],
    displayTitle: [
      toTitle(($) => $filter($, $('.post-title'))),
      toTitle(($) => $filter($, $('.entry-title'))),
      toTitle(($) => $filter($, $('h1[class*="title" i] a'))),
      toTitle(($) => $filter($, $('h1[class*="title" i]'))),
      toTitle(($) => $filter($, $('h1'))),
    ],
  }

  return rules
}
