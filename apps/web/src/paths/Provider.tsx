import React, { createContext, useContext } from 'react'
import { type TopicMetadata } from '@sherpa/data/topic'

interface PathsContextValue {
  paths: TopicMetadata[]
}

const PathsContext = createContext<PathsContextValue | null>(null)

export const usePathsContext = () => {
  const context = useContext(PathsContext)

  if (!context) throw new Error('usePathsContext error: PathsContext not found')

  return context
}

interface Props {
  paths: TopicMetadata[]
  children: React.ReactNode
}

const PathsContextProvider = ({ children, paths }: Props) => {
  const context = {
    paths,
  }

  return (
    <PathsContext.Provider value={context}>{children}</PathsContext.Provider>
  )
}

export default PathsContextProvider
