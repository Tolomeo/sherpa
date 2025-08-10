import { confirm } from './common/command'

const main = async () => {
  const c = await confirm('this is a test')
  console.log(c, typeof c)
}

main().catch(console.error)
