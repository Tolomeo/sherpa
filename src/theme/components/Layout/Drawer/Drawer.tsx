import React, { useLayoutEffect } from 'react'
import { useLayoutContext } from '../Context'
// import MuiDrawer from '@mui/material/Drawer'
type Props = {}

const Drawer: React.FC<Props> = ({ children }) => {
  const { registerDrawer, unregisterDrawer, getDrawer } = useLayoutContext()

  useLayoutEffect(() => {
    registerDrawer('menu')
    return () => unregisterDrawer('menu')
  }, [])

  return getDrawer('menu') ? <span>{children}</span> : null
}

export default Drawer
