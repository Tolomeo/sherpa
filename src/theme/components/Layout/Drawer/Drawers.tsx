import React, { useLayoutEffect } from 'react'
import { useLayoutContext } from '../Context'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'

const Drawers = () => {
  const { getDrawers, setDrawer } = useLayoutContext()

  return (
    <>
      {Object.entries(getDrawers()).map(([drawerName, drawer]) => (
        <MuiDrawer
          anchor="right"
          key={drawerName}
          open={drawer.open}
          onClose={() => setDrawer(drawerName, { open: false })}
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
            <Toolbar />
            <Box padding={6}>{drawer.children}</Box>
          </Box>
        </MuiDrawer>
      ))}
    </>
  )
}

export default Drawers
