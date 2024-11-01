import * as readline from 'node:readline'
import format from './format'
import log from './log'

type Nullable<T> = T | null

enum LoopCommand {
  REPEAT,
  END,
}

const loop = async (fn: () => LoopCommand | Promise<LoopCommand>) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition -- the end of the loop is determined by fn return value
  while (true) {
    const loopAction = await fn()

    switch (loopAction) {
      case LoopCommand.REPEAT:
        continue
      case LoopCommand.END:
        return
    }
  }
}
loop.REPEAT = LoopCommand.REPEAT
loop.END = LoopCommand.END

interface InputOptions {
  answer?: string
}

const input = (question: string, options: InputOptions = {}) => {
  const describedQuestion = format.lead(`\n${question}\n[q] cancel\n> `)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const promise = new Promise<Nullable<string>>((resolve) => {
    rl.question(describedQuestion, (answer) => {
      rl.close()

      if (answer.trim() === 'q') resolve(null)
      else resolve(answer)
    })

    if (options.answer) {
      rl.write(options.answer)
    }
  })

  return promise
}

const choice = async <T extends string>(
  question: string,
  choices: T[],
  options: { answer?: T } = {},
): Promise<Nullable<T>> => {
  const describedQuestion = `${question}\n${choices
    .map((option, idx) => `[${idx + 1}] ${option}`)
    .join('\n')}`

  let choiceAnswer: T | undefined

  const defaultChoice = options.answer
    ? (() => {
        const defaultChoiceIndex = choices.indexOf(options.answer)
        return defaultChoiceIndex > -1 ? `${defaultChoiceIndex + 1}` : undefined
      })()
    : undefined

  while (!choiceAnswer) {
    const answer = await input(describedQuestion, { answer: defaultChoice })

    if (answer === null) return null

    const answerIndex = parseInt(answer, 10)

    if (isNaN(answerIndex) || !choices[answerIndex - 1]) {
      log.error('\nInvalid choice')
      continue
    }

    choiceAnswer = choices[answerIndex - 1]
  }

  return choiceAnswer
}

const confirm = async (question: string): Promise<Nullable<boolean>> => {
  const confirmOptionsMap: Record<string, boolean> = {
    yes: true,
    no: false,
  }
  const confirmOptions = Object.keys(confirmOptionsMap)

  const optionAnswer = await choice(question, confirmOptions)

  if (optionAnswer === null) return null

  return confirmOptionsMap[optionAnswer]
}

export default {
  loop,
  input,
  choice,
  confirm,
}
