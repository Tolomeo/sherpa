import React, { createContext, useContext, useEffect, useState } from 'react'
import { type PopulatedTopicData } from '@sherpa/data/topic'
import { type ResourceData } from '@sherpa/data/resource'
import { useResourcesCompletionStore } from './utils'

interface PathContextValue {
  path: PopulatedTopicData
}

const PathContext = createContext<PathContextValue | null>(null)

export const usePathContext = () => {
  const pathContext = useContext(PathContext)

  if (!pathContext)
    throw new Error('usePathContext error: PathContext not found')

  return pathContext
}

export const usePathResourcesCompletion = (
  resources: ResourceData[],
): [
  Record<ResourceData['url'], boolean>,
  {
    complete: (_: ResourceData['url']) => Promise<void>
    uncomplete: (_: ResourceData['url']) => Promise<void>
  },
] => {
  const {
    path: { topic },
  } = usePathContext()
  const resourcesCompletionStore = useResourcesCompletionStore()

  const [completion, setCompletion] = useState(
    resources
      .map(({ url }) => url)
      .reduce<Record<string, boolean>>((initialCompletion, url) => {
        initialCompletion[url] = false
        return initialCompletion
      }, {}),
  )

  useEffect(() => {
    const setStoredCompletion = async () => {
      const resourcesUrls = resources.map(({ url }) => url)
      const storedCompletion = await resourcesCompletionStore.areCompleted(
        resourcesUrls,
        topic,
      )
      const storedUrlsCompletion = resourcesUrls.reduce<
        Record<string, boolean>
      >((_urlsCompletion, url, index) => {
        _urlsCompletion[url] = storedCompletion[index]
        return _urlsCompletion
      }, {})
      setCompletion(storedUrlsCompletion)
    }

    // TODO: Check how to deal with this
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    setStoredCompletion()
  }, [resources, resourcesCompletionStore, topic])

  const complete = async (resource: string) => {
    if (!(resource in completion))
      throw new Error(`${resource} not found among initialization resources`)

    const success = await resourcesCompletionStore.complete(resource, topic)

    if (success)
      setCompletion((currentCompletion: Record<string, boolean>) => ({
        ...currentCompletion,
        [resource]: true,
      }))
  }

  const uncomplete = async (resource: string) => {
    if (!(resource in completion))
      throw new Error(`${resource} not found among initialization resources`)

    const success = await resourcesCompletionStore.uncomplete(resource, topic)

    if (success)
      setCompletion((currentCompletion: Record<string, boolean>) => ({
        ...currentCompletion,
        [resource]: false,
      }))
  }

  return [completion, { complete, uncomplete }]
}

interface Props {
  path: PopulatedTopicData
  children: React.ReactNode
}

const PathContextProvider = ({ children, path }: Props) => {
  const context = {
    path,
  }

  return <PathContext.Provider value={context}>{children}</PathContext.Provider>
}

export default PathContextProvider
