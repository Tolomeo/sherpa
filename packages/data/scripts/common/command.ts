import enquirer from 'enquirer'

enum LoopCommand {
  REPEAT,
  END,
}

export const loop = async (fn: () => LoopCommand | Promise<LoopCommand>) => {
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

export const input = async (message: string, options: InputOptions = {}) => {
  const { answer } = await enquirer
    .prompt<{ answer: string }>({
      type: 'input',
      name: 'answer',
      message,
      initial: options.answer,
    })
    .catch(() => ({ answer: null }))

  return answer
}

export const choice = async <T extends string>(
  message: string,
  choices: T[],
  options: { answer?: T } = {},
) => {
  const { answer } = await enquirer
    .prompt<{ answer: T }>({
      type: 'select',
      name: 'answer',
      message,
      // @ts-expect-error -- choices is part of select prompt options, but somehow not recognised here
      choices,
      initial: options.answer,
    })
    .catch(() => ({ answer: null }))

  return answer
}

export const confirm = async (message: string, { initial = false } = {}) => {
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

export default {
  loop,
  input,
  choice,
  confirm,
}
