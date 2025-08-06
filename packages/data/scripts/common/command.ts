import { createCommand } from 'commander'
import enquirer from 'enquirer'

// TODO: action command
// similar to choice, but accepts a record with value fn
// choosing the option will execute the fn

enum LoopControlCommand {
  REPEAT,
  END,
}

const loopControl = {
  repeat: LoopControlCommand.REPEAT,
  end: LoopControlCommand.END,
} as const

type LoopControl = typeof loopControl

export const loop = async (
  fn: (
    control: LoopControl,
  ) => LoopControlCommand | Promise<LoopControlCommand>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition -- the end of the loop is determined by fn return value
  while (true) {
    const loopAction = await fn(loopControl)

    switch (loopAction) {
      case LoopControlCommand.REPEAT:
        continue
      case LoopControlCommand.END:
        return
    }
  }
}

interface InputOptions {
  initial?: string
}

export const input = async (
  message: string,
  { initial }: InputOptions = {},
) => {
  const { answer } = await enquirer
    .prompt<{ answer: string }>({
      type: 'input',
      name: 'answer',
      message,
      initial,
    })
    .catch(() => ({ answer: null }))

  return answer
}

interface ChoiceOptions<T> {
  initial?: T
}

export const choice = async <T extends string>(
  message: string,
  choices: T[],
  { initial }: ChoiceOptions<T> = {},
) => {
  const { answer } = await enquirer
    .prompt<{ answer: T }>({
      type: 'select',
      name: 'answer',
      message,
      // @ts-expect-error -- choices is part of select prompt options, but somehow not recognised here
      choices,
      initial,
    })
    .catch(() => ({ answer: null }))

  return answer
}

interface ConfirmOptions {
  initial?: boolean
}

export const confirm = async (
  message: string,
  { initial = false }: ConfirmOptions = {},
) => {
  const { answer } = await enquirer
    .prompt<{ answer: boolean }>({
      type: 'confirm',
      name: 'answer',
      message,
      initial,
    })
    .catch(() => ({ answer: null }))

  return answer
}

export const create = createCommand
