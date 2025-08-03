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

export { loop }
