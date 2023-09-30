import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Resource, Path, Paths, PopulatedPath } from './types'
import { populatePath } from './utils'

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
