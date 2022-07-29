import React, { useLayoutEffect } from 'react'
import Link from 'next/link'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import MenuIcon from '@mui/icons-material/Menu'
import IconButton from '@mui/material/IconButton'
import Logo from '../Logo'
import Container from './Container'
import { useLayoutContext, useLayoutDrawer } from './Context'

const DrawerToggle = () => {
  const { toggle } = useLayoutDrawer('menu')

  return (
    <IconButton color="inherit" aria-label="Open drawer" onClick={toggle}>
      <MenuIcon />
    </IconButton>
  )
}

const Header: React.FC = ({ children }) => {
  return (
    <AppBar position="sticky">
      <Container>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1 }}>
            <Link href="/" passHref>
              <a>
                <Logo />
              </a>
            </Link>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {children}
            <DrawerToggle />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default Header
