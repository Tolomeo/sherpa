import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Resource, Path, Paths } from '../../data'
import config from '../config'
import { groupResourcesByType, sortResources } from '../resources'

export interface PopulatedPath {
  title: Path['title']
  logo: Path['logo']
  hero: Path['hero']
  notes: Path['notes']
  resources: Array<{ title: string; resources: Array<Resource> }> | null
  main: Array<Resource> | null
  children: Array<{
    title: string
    main: Array<Resource> | null
    resources: Array<Resource> | null
  }> | null
  next: Path['next']
  prev: Path['prev']
}

type PathContextValue = {
  path: PopulatedPath
  paths: Paths
}

// TODO: split context into 2
const PathContext = createContext<PathContextValue | null>(null)

export const usePathContext = () => {
  const pathContext = useContext(PathContext)

  if (!pathContext)
    throw new Error('usePathContext error: PathContext not found')

  return pathContext
}

type Props = {
  path: Path
  resources: Resource[]
  paths: Paths
  children: React.ReactNode
}

const populatePath = (path: Path, resources: Resource[]): PopulatedPath => {
  const resourcesMap = resources.reduce((map, resource) => {
    map[resource.url] = resource
    return map
  }, {} as Record<Resource['url'], Resource>)

  return {
    ...path,
    main: (() => {
      if (!path.main) return null

      return path.main.map((resourceId) => {
        return resourcesMap[resourceId]
      })
    })(),
    resources: (() => {
      if (!path.resources) return null

      return groupResourcesByType(
        path.resources.map((resourceId) => {
          return resourcesMap[resourceId]
        }),
      ).map((group) => ({
        ...group,
        resources: sortResources(group.resources),
      }))
    })(),
    children: (() => {
      if (!path.children) return null

      return path.children.map(({ title, main, resources }) => {
        return {
          title,
          main: (() => {
            if (!main) return null

            return main.map((resourceId) => {
              return resourcesMap[resourceId]
            })
          })(),
          resources: (() => {
            if (!resources) return null

            return sortResources(
              resources.map((resourceId) => {
                return resourcesMap[resourceId]
              }),
            )
          })(),
        }
      })
    })(),
  }
}

const PathContextProvider = ({ children, path, resources, paths }: Props) => {
  const [populatedPath, setPopulatedPath] = useState(
    populatePath(path, resources),
  )
  const context = useMemo(
    () => ({
      path: populatedPath,
      paths,
    }),
    [populatedPath, paths],
  )

  useEffect(() => {
    setPopulatedPath(populatePath(path, resources))
  }, [path, resources])

  return <PathContext.Provider value={context}>{children}</PathContext.Provider>
}

export default PathContextProvider
