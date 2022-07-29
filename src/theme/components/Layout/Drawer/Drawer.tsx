import React, { useLayoutEffect } from 'react'
import { useLayoutContext } from '../Context'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import ToolBar from '@mui/material/ToolBar'
import AppBar from '@mui/material/AppBar'
type Props = {}

const Drawer: React.FC<Props> = ({ children }) => {
  const { registerDrawer, unregisterDrawer, getDrawer, setDrawer } =
    useLayoutContext()

  useLayoutEffect(() => {
    registerDrawer('menu')
    return () => unregisterDrawer('menu')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MuiDrawer
      anchor="right"
      open={getDrawer('menu')}
      onClose={() => setDrawer('menu', false)}
      elevation={0}
    >
      <Box sx={{ width: 250 }}>
        <AppBar position="static">
          <ToolBar />
        </AppBar>
        <Box padding={6}>{children}</Box>
      </Box>
    </MuiDrawer>
  )
}

export default Drawer
