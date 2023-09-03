import React from 'react'
import Link from 'next/link'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Logo from '../../Logo'
import ThemeModeToggle from './ThemeModeToggle'
import GitHubLink from './GitHubLink'

const Header: React.FC = ({ children }) => {
  return (
    <AppBar position="sticky">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1 }}>
            <Link href="/">
              <Logo />
            </Link>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {children}
            <GitHubLink />
            <ThemeModeToggle />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default Header
