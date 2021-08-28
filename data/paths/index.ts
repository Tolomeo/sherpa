import resources, { Resource } from '../resources'
import htmlcss from './html&css.json'
import javascript from './javascript.json'
import typescript from './typescript.json'
import react from './react.json'
import reacttypescript from './react&typescript.json'
import git from './git.json'

export interface Path {
  title: string
  resources: Array<keyof typeof resources>
  next: Array<keyof typeof paths>
  prev: Array<keyof typeof paths>
}

export interface PopulatedPath {
  title: string
  resources: Resource[]
  next: Paths
  prev: Paths
}

export type Paths = {
  [pathName: string]: Path
}

const paths = <Paths>{
  htmlcss,
  javascript,
  typescript,
  react,
  reacttypescript,
  git,
}

export const populatePath = (path: Path): PopulatedPath => ({
  ...path,
  resources: path.resources
    .map((resourceId) => resources[resourceId])
    .filter(Boolean),
  next: path.next.reduce((nextPaths, nextPathId) => {
    if (paths[nextPathId]) nextPaths[nextPathId] = paths[nextPathId]

    return nextPaths
  }, {} as Paths),
  prev: path.prev.reduce((prevPaths, prevPathId) => {
    if (paths[prevPathId]) prevPaths[prevPathId] = paths[prevPathId]

    return prevPaths
  }, {} as Paths),
})

export const hasNextPaths = (path: PopulatedPath) => {
  return Boolean(Object.keys(path.next).length)
}

export const hasPrevPaths = (path: PopulatedPath) => {
  return Boolean(Object.keys(path.prev).length)
}

export default paths
