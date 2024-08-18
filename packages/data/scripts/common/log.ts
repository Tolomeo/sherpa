import type { JSONSerializable } from './util'
import format from './format'

export const log = {
  text(text: string) {
    return console.log(`\n${text}`)
  },
  lead(text: string) {
    return log.text(format.lead(text))
  },
  error(text: string) {
    return log.text(format.error(text))
  },
  success(text: string) {
    return log.text(format.success(text))
  },
  warning(text: string) {
    return log.text(format.warning(text))
  },
  inspect(
    stringifiable: JSONSerializable,
    options: { highlight?: string } = {},
  ) {
    let stringified = format.stringify(stringifiable)

    if (options.highlight) {
      stringified = stringified.replace(
        new RegExp(options.highlight, 'g'),
        (match) => format.highlight(match),
      )
    }

    return log.text(stringified)
  },
}

export default log
