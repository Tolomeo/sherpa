import { SerializedResources } from './types'
import { parseResources } from './utils'
import alternatives from './alternatives.json'
import htmlcss from './htmlcss.json'
import webaccessibility from './webaccessibility.json'
import javascript from './javascript.json'
import typescript from './typescript.json'
import react from './react.json'
import next from './next.json'
import npm from './npm.json'
import node from './node.json'
import git from './git.json'
import python from './python.json'
import regex from './regex.json'
import neovim from './neovim.json'
import lua from './lua.json'

const alternateSources = parseResources(alternatives as SerializedResources)

const resources = parseResources([
  ...htmlcss,
  ...webaccessibility,
  ...javascript,
  ...typescript,
  ...react,
  ...next,
  ...npm,
  ...node,
  ...git,
  ...python,
  ...regex,
  ...neovim,
  ...lua,
] as SerializedResources)

export { alternateSources }
export default resources
export * from './types'
