import * as readline from 'node:readline'
import format from './format'
import log from './log'

type Nullable<T> = T | null

enum LoopCommand {
  REPEAT,
  END,
}

const loop = async (fn: () => LoopCommand | Promise<LoopCommand>) => {
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

const input = (question: string): Promise<Nullable<string>> => {
  const describedQuestion = format.lead(`\n${question}\n[q] cancel\n> `)
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

const choice = async <T extends string>(
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
