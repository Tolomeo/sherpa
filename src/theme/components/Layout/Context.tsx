import React, { createContext, useContext, useState } from 'react'
import Box from '@mui/material/Box'

type LayoutDrawers = Record<string, boolean>

type LayoutContextValue = {
  drawers: LayoutDrawers
  setDrawers: React.Dispatch<React.SetStateAction<LayoutDrawers>>
  registerDrawer: (name: string, open?: boolean) => void
  unregisterDrawer: (name: string) => void
  getDrawer: (name: string) => boolean
  setDrawer: (name: string, open: boolean) => void
  toggleDrawer: (name: string) => void
}

const LayoutContext = createContext<LayoutContextValue | null>(null)

export const useLayoutContext = () => {
  const layoutContext = useContext(LayoutContext)

  if (!layoutContext)
    throw new Error('useLayoutContext error: LayoutContext not found')

  return layoutContext
}

type Props = {
  children: React.ReactNode
}

const LayoutContextProvider = ({ children }: Props) => {
  const [drawers, setDrawers] = useState<Record<string, boolean>>({})
  const registerDrawer = (name: string, open: boolean = false) => {
    if (name in drawers) return
    setDrawers({ ...drawers, [name]: open })
  }
  const unregisterDrawer = (name: string) => {
    if (!(name in drawers)) return

    const newDrawers = { ...drawers }
    delete newDrawers[name]
    setDrawers(newDrawers)
  }
  const getDrawer = (name: string) => {
    return drawers[name]
  }
  const setDrawer = (name: string, open: boolean) => {
    if (!(name in drawers)) return
    setDrawers({ ...drawers, [name]: open })
  }
  const toggleDrawer = (name: string) => setDrawer(name, !getDrawer(name))
  const context = {
    drawers,
    setDrawers,
    registerDrawer,
    unregisterDrawer,
    getDrawer,
    setDrawer,
    toggleDrawer,
  }

  return (
    <LayoutContext.Provider value={context}>
      <Box>{children}</Box>
    </LayoutContext.Provider>
  )
}

export default LayoutContextProvider
