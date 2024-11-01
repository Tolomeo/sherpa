import React from 'react'
import type { DrawerProps } from '@mui/material/Drawer'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { useLayoutContext } from '../Context'

type Props = Omit<DrawerProps, 'anchor' | 'elevation' | 'open' | 'onClose'> & {
  children: React.ReactNode
}

const Drawer: React.FC<Props> = ({ children, ...props }) => {
  const { drawerOpen, closeDrawer } = useLayoutContext()

  return (
    <MuiDrawer
      {...props}
      anchor="right"
      elevation={2}
      open={drawerOpen}
      onClose={closeDrawer}
    >
      <Box
        sx={{
          width: {
            xs: 345,
            md: 450,
            lg: 600,
            xl: 750,
          },
        }}
      >
        <Toolbar />
        <Box padding={6}>{children}</Box>
      </Box>
    </MuiDrawer>
  )
}

export default Drawer
