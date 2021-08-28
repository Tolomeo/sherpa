import resources, { Resource } from '../resources'
import htmlcss from './html&css.json'
import javascript from './javascript.json'
import typescript from './typescript.json'
import reactredux from './react&redux.json'
import git from './git.json'

export interface Path {
  title: string
  resources: string[]
}

export interface PopulatedPath {
  title: string
  resources: Resource[]
}

export type Paths = {
  [pathName: string]: Path
}

export const populatePath = (path: Path): PopulatedPath => ({
  ...path,
  resources: path.resources
    .map((resourceId) => resources[resourceId])
    .filter(Boolean),
})

const paths = <Paths>{
  htmlcss,
  javascript,
  typescript,
  reactredux,
  git,
}

export default paths
