import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Path, Resource, ParsedPath, PathsList } from '../../data'
import config from '../config'

type PathContextValue = {
  topic: (typeof config.topics)[number]
  title: Path['title']
  hero: Path['hero']
  logo: Path['logo']
  prev: Path['prev']
  main: Path['main']
  resources: Path['resources']
  children: Path['children']
  next: Path['next']
}

const PathContext = createContext<PathContextValue | null>(null)

export const usePathContext = () => {
  const pathContext = useContext(PathContext)

  if (!pathContext)
    throw new Error('usePathContext error: PathContext not found')

  return pathContext
}

type Props = {
  topic: (typeof config.topics)[number]
  path: ParsedPath
  resources: Resource[]
  paths: PathsList
  children: React.ReactNode
}

const populatePath = (parsedPath: ParsedPath, resources: Resource[]): Path => {
  const resourcesMap = resources.reduce((map, resource) => {
    map[resource.url] = resource
    return map
  }, {} as Record<Resource['url'], Resource>)

  return {
    ...parsedPath,
    resources: (() => {
      if (!parsedPath.resources) return null

      return parsedPath.resources.map((resourceId) => {
        return resourcesMap[resourceId]
      })
    })(),
    main: (() => {
      if (!parsedPath.main) return null

      return parsedPath.main.map((resourceId) => {
        return resourcesMap[resourceId]
      })
    })(),
    children: (() => {
      if (!parsedPath.children) return null

      return parsedPath.children.map((childPath) =>
        populatePath(childPath, resources),
      )
    })(),
  }
}

const PathContextProvider = ({
  children,
  path,
  resources,
  topic,
  paths,
}: Props) => {
  const [populatedPath, setPopulatedPath] = useState(
    populatePath(path, resources),
  )
  const context = useMemo(
    () => ({
      topic,
      ...populatedPath,
      paths,
    }),
    [populatedPath, paths, topic],
  )

  useEffect(() => {
    setPopulatedPath(populatePath(path, resources))
  }, [path, resources])

  return <PathContext.Provider value={context}>{children}</PathContext.Provider>
}

export default PathContextProvider
