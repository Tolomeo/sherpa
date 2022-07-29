import React from 'react'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import LayoutContext, { useLayoutContext } from './Context'
import Header from './Header'
import Container from './Container'
import Hero from './Hero'
import Villain from './Villain'
import Drawer from './Drawer'
import ToolBar from '@mui/material/ToolBar'
import AppBar from '@mui/material/AppBar'

const Drawers = () => {
  const { drawers, setDrawer } = useLayoutContext()

  return (
    <>
      {Object.entries(drawers).map(([drawerName, drawerOpen]) => (
        <MuiDrawer
          anchor="right"
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

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <LayoutContext>
      <Box>{children}</Box>
      <Drawers />
    </LayoutContext>
  )
}

Layout.Header = Header
Layout.Container = Container
Layout.Hero = Hero
Layout.Villain = Villain
Layout.Drawer = Drawer
export default Layout
