import React, { createContext, useContext, useState } from 'react'
import { Path } from '../../data'
import config from '../config'

type PathContextValue = {
  topic: (typeof config.topics)[number]
  path: Path
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
    throw new Error('useLayoutContext error: PathContext not found')

  return pathContext
}

type Props = {
  children: React.ReactNode
  path: Path
  topic: (typeof config.topics)[number]
}

const PathContextProvider = ({ children, path, topic }: Props) => {
  const {
    title,
    logo,
    hero,
    prev,
    main,
    resources,
    children: pathChildren,
    next,
  } = path
  const context = {
    topic,
    path,
    title,
    logo,
    hero,
    prev,
    main,
    resources,
    children: pathChildren,
    next,
  }

  return <PathContext.Provider value={context}>{children}</PathContext.Provider>
}

export default PathContextProvider
