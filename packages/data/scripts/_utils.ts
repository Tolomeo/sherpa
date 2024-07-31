import * as readline from 'node:readline'
import chalk from 'chalk'
import * as JSDiff from 'diff'

export const log = {
  text(text: string) {
    return console.log(chalk.white(text))
  },
  heading(text: string) {
    return console.log(chalk.magenta(text))
  },
  error(text: string) {
    return console.log(chalk.red(text))
  },
  success(text: string) {
    return console.log(chalk.green(text))
  },
  warning(text: string) {
    return console.log(chalk.yellow(text))
  },
  inspect(thing: any, options: { highlight?: string } = {}) {
    let thingString = JSON.stringify(thing, null, 2)

    if (options.highlight) {
			// TODO: replaceAll
      thingString = thingString.replace(options.highlight, (match) =>
        chalk.black.bgYellow(match),
      )
    }

    return log.text(thingString)
  },
}

export { default as open } from 'open'

type Nullable<T> = T | null

interface DiffFile {
  name?: string
  content: string
  header?: string
}

interface DiffOptions {
  context: number
}

// https://github.com/j-f1/cli-diff/blob/master/src/index.ts
export function diff(
  oldFile: DiffFile | string,
  newFile: DiffFile | string,
  options?: DiffOptions,
): string {
  if (typeof oldFile === 'string') {
    oldFile = { content: oldFile }
  }
  if (typeof newFile === 'string') {
    newFile = { content: newFile }
  }

  return (
    JSDiff.createTwoFilesPatch(
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
  )
}

export const input = (question: string): Promise<Nullable<string>> => {
  const describedQuestion = chalk.cyan(`\n${question}\n[q] cancel\n> `)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(describedQuestion, (answer) => {
      rl.close()

      if (answer.trim() === 'q') resolve(null)
      else resolve(answer)
    })
  })
}

export const choice = async <T extends string>(
  question: string,
  options: T[],
): Promise<Nullable<T>> => {
  const describedQuestion = `${question}\n${options
    .map((option, idx) => `[${idx + 1}] ${option}`)
    .join('\n')}`

  let optionAnswer: T | undefined

  while (!optionAnswer) {
    const answer = await input(describedQuestion)

    if (answer === null) return null

    const answerIndex = parseInt(answer, 10)

    if (isNaN(answerIndex) || !options[answerIndex - 1]) {
      log.error('\nInvalid choice')
      continue
    }

    optionAnswer = options[answerIndex - 1]
  }

  return optionAnswer
}

export const confirm = async (question: string): Promise<Nullable<boolean>> => {
  const confirmOptionsMap: Record<string, boolean> = {
    yes: true,
    no: false,
  }
  const confirmOptions = Object.keys(confirmOptionsMap)

  const optionAnswer = await choice(question, confirmOptions)

  if (optionAnswer === null) return null

  return confirmOptionsMap[optionAnswer]
}
