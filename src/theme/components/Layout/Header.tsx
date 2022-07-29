import React, { useLayoutEffect } from 'react'
import Link from 'next/link'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import GitHubIcon from '@mui/icons-material/GitHub'
import MenuIcon from '@mui/icons-material/Menu'
import IconButton from '@mui/material/IconButton'
import Logo from '../Logo'
import Container from './Container'
import { useLayoutContext } from './Context'

const GithubLink = () => {
  return (
    <IconButton
      color="inherit"
      aria-label="Go to repository"
      href={process.env.NEXT_PUBLIC_GITHUB_URL!}
    >
      <GitHubIcon />
    </IconButton>
  )
}

const DrawerToggle = () => {
  const { toggleDrawer, registerDrawer, unregisterDrawer } = useLayoutContext()

  useLayoutEffect(() => {
    registerDrawer('menu')
    return () => unregisterDrawer('menu')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onClick = () => toggleDrawer('menu')

  return (
    <IconButton color="inherit" aria-label="Open drawer" onClick={onClick}>
      <MenuIcon />
    </IconButton>
  )
}

const ResponsiveAppBar = () => {
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
            <GithubLink />
            <DrawerToggle />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default ResponsiveAppBar
