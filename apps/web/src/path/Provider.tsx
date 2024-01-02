import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Resource, Path, PopulatedPath } from './types'
import { populatePath, useResourcesCompletionStore } from './utils'

type PathContextValue = {
  path: PopulatedPath
}

const PathContext = createContext<PathContextValue | null>(null)

export const usePathContext = () => {
  const pathContext = useContext(PathContext)

  if (!pathContext)
    throw new Error('usePathContext error: PathContext not found')

  return pathContext
}

export const usePathResourcesCompletion = (
  resources: Resource[],
): [
  Record<Resource['url'], boolean>,
  {
    complete: (url: Resource['url']) => Promise<void>
    uncomplete: (url: Resource['url']) => Promise<void>
  },
] => {
  const {
    path: { topic },
  } = usePathContext()
  const resourcesCompletionStore = useResourcesCompletionStore()

  const [completion, setCompletion] = useState(
    resources
      .map(({ url }) => url)
      .reduce((initialCompletion, url) => {
        initialCompletion[url] = false
        return initialCompletion
      }, {} as Record<string, boolean>),
  )

  useEffect(() => {
    const setStoredCompletion = async () => {
      const resourcesUrls = resources.map(({ url }) => url)
      const storedCompletion = await resourcesCompletionStore.areCompleted(
        resourcesUrls,
        topic,
      )
      const storedUrlsCompletion = resourcesUrls.reduce(
        (_urlsCompletion, url, index) => {
          _urlsCompletion[url] = storedCompletion[index]
          return _urlsCompletion
        },
        {} as Record<string, boolean>,
      )
      setCompletion(storedUrlsCompletion)
    }

    setStoredCompletion()
  }, [resources, resourcesCompletionStore, topic])

  const complete = async (resource: string) => {
    if (!(resource in completion))
      throw new Error(`${resource} not found among initialization resources`)

    const success = await resourcesCompletionStore.complete(resource, topic)

    if (success)
      setCompletion((currentCompletion) => ({
        ...currentCompletion,
        [resource]: true,
      }))
  }

  const uncomplete = async (resource: string) => {
    if (!(resource in completion))
      throw new Error(`${resource} not found among initialization resources`)

    const success = await resourcesCompletionStore.uncomplete(resource, topic)

    if (success)
      setCompletion((currentCompletion) => ({
        ...currentCompletion,
        [resource]: false,
      }))
  }

  return [completion, { complete, uncomplete }]
}

type Props = {
  path: Path
  resources: Resource[]
  children: React.ReactNode
}

const PathContextProvider = ({ children, path, resources }: Props) => {
  const [populatedPath, setPopulatedPath] = useState(
    populatePath(path, resources),
  )
  const context = useMemo(
    () => ({
      path: populatedPath,
    }),
    [populatedPath],
  )

  useEffect(() => {
    setPopulatedPath(populatePath(path, resources))
  }, [path, resources])

  return <PathContext.Provider value={context}>{children}</PathContext.Provider>
}

export default PathContextProvider
