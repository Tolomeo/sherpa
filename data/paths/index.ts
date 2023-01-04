import { SerializedPaths } from './types'
import { parsePaths } from './utils'
import uidesign from './uidesign.json'
import htmlcss from './htmlcss.json'
import webaccessibility from './webaccessibility.json'
import javascript from './javascript.json'
import npm from './npm.json'
import typescript from './typescript.json'
import react from './react.json'
import next from './next.json'
import node from './node.json'
import docker from './docker.json'
import git from './git.json'
import python from './python.json'
import regex from './regex.json'
import neovim from './neovim.json'
import lua from './lua.json'

const serializedPaths = {
  uidesign,
  htmlcss,
  webaccessibility,
  javascript,
  typescript,
  react,
  next,
  npm,
  node,
  docker,
  git,
  python,
  regex,
  neovim,
  lua,
}

const paths = parsePaths(
  serializedPaths as SerializedPaths<keyof typeof serializedPaths>,
)

export * from './utils'
export default paths
export * from './types'
