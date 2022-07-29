import React from 'react'
import Link from 'next/link'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import SubjectIcon from '@mui/icons-material/Subject'
import IconButton from '@mui/material/IconButton'
import Logo from '../Logo'
import Container from '@mui/material/Container'
import { useLayoutDrawer } from './Context'

const DrawerToggle = () => {
  const { toggle } = useLayoutDrawer('menu')

  return (
    <IconButton color="inherit" aria-label="Open drawer" onClick={toggle}>
      <SubjectIcon />
    </IconButton>
  )
}

const Header: React.FC = ({ children }) => {
  return (
    <AppBar position="sticky">
      <Container maxWidth={false}>
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
