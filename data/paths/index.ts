import resources, { Resource } from '../resources'
import { SerializedPaths } from './types'
import { parsePaths } from './utils'
import htmlcss from './htmlcss.json'
import webaccessibility from './webaccessibility.json'
import javascript from './javascript.json'
import npm from './npm.json'
import typescript from './typescript.json'
import react from './react.json'
import reacttypescript from './reacttypescript.json'
import next from './next.json'
import node from './node.json'
import git from './git.json'
import regex from './regex.json'
import neovim from './neovim.json'
import lua from './lua.json'

const serializedPaths = {
  htmlcss,
  webaccessibility,
  javascript,
  typescript,
  react,
  reacttypescript,
  next,
  npm,
  node,
  git,
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
