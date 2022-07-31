import React, { useLayoutEffect } from 'react'
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
          elevation={2}
        >
          <Box
            sx={{
              width: {
                xs: 300,
                md: 450,
                lg: 600,
                xl: 750,
              },
            }}
          >
            <ToolBar />
            <Box padding={6}>{drawerName}</Box>
          </Box>
        </MuiDrawer>
      ))}
    </>
  )
}

export default Drawers
