import React, { createContext, useContext, useState } from 'react'
import { Path } from '../../data'
import config from '../config'

type PathContextValue = {
  path: Path
  topic: (typeof config.topics)[number]
}

const PathContext = createContext<PathContextValue | null>(null)

export const usePathContext = () => {
  const pathContext = useContext(PathContext)

  if (!pathContext)
    throw new Error('useLayoutContext error: PathContext not found')

  return pathContext
}

type Props = {
  children: React.ReactNode
  path: Path
  topic: (typeof config.topics)[number]
}

const PathContextProvider = ({ children, path, topic }: Props) => {
  const context = { topic, path }

  return <PathContext.Provider value={context}>{children}</PathContext.Provider>
}

export default PathContextProvider
