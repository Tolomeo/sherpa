import React from 'react'
import { useLayoutContext } from '../Context'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import ToolBar from '@mui/material/ToolBar'

const Drawers = () => {
  const { getDrawers, setDrawer } = useLayoutContext()

  return (
    <>
      {Object.entries(getDrawers()).map(([drawerName, drawerOpen]) => (
        <MuiDrawer
          anchor="right"
          key={drawerName}
          open={drawerOpen}
          onClose={() => setDrawer('menu', false)}
          elevation={0}
        >
          <Box sx={{ width: 350 }}>
            <ToolBar />
            <Box padding={6}>{drawerName}</Box>
          </Box>
        </MuiDrawer>
      ))}
    </>
  )
}

export default Drawers
