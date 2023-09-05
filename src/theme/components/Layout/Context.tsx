import React, { createContext, useContext, useState } from 'react'
import { DrawerProps } from '@mui/material/Drawer'
import Box from '@mui/material/Box'

type LayoutContextValue = {
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
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
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }
  const openDrawer = () => {
    setDrawerOpen(true)
  }
  const closeDrawer = () => {
    setDrawerOpen(false)
  }

  const context = {
    drawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  }

  return (
    <LayoutContext.Provider value={context}>
      <Box>{children}</Box>
    </LayoutContext.Provider>
  )
}

export default LayoutContextProvider
