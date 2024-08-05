import chalk from 'chalk'
import * as JSDiff from 'diff'
import type { JSONSerializable } from './util'

interface DiffFile {
  name?: string
  content: string
  header?: string
}

export interface DiffOptions {
  context: number
}

const format = {
  stringify(stringifiable: JSONSerializable) {
    return JSON.stringify(stringifiable, null, 2)
  },
  lead(text: string) {
    return chalk.cyan(text)
  },
  error(text: string) {
    return chalk.red(text)
  },
  success(text: string) {
    return chalk.green(text)
  },
  warning(text: string) {
    return chalk.yellow(text)
  },
  highlight(text: string) {
    return chalk.black.bgYellow(text)
  },
  // https://github.com/j-f1/cli-diff/blob/master/src/index.ts
  diff(
    oldContent: JSONSerializable,
    newContent: JSONSerializable,
    options?: DiffOptions,
  ) {
    const oldFile: DiffFile = { content: format.stringify(oldContent) }
    const newFile: DiffFile = { content: format.stringify(newContent) }

    const diff = JSDiff.createTwoFilesPatch(
      oldFile.name || '',
      newFile.name || '',
      oldFile.content,
      newFile.content,
      oldFile.header || '',
      newFile.header || '',
      options,
    )
      .split('\n')
      // remove "Index:" (if files are the same) and "====..."
      .slice(oldFile.name === newFile.name ? 2 : 1)
      // remove +++ and --- lines if the file name and header are blank
      .slice(
        oldFile.name || newFile.name || oldFile.header || newFile.header
          ? 0
          : 2,
      )
      .map((chunk) => {
        switch (chunk[0]) {
          case '+':
            return chalk.green(chunk)
          case '-':
            return chalk.red(chunk)
          case '@':
            return chalk.dim.blue(chunk)
          // \ No newline at end of file
          case '\\':
            return chalk.dim.yellow(chunk)
          default:
            return chunk
        }
      })
      .join('\n')

    if (!diff) {
      return chalk.grey(oldFile.content)
    }

    return diff
  },
}

export default format
