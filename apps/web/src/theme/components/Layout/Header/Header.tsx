import React from 'react'
import Link from 'next/link'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Logo from '../../Logo'
import ThemeModeToggle from './ThemeModeToggle'
import GitHubLink from './GitHubLink'

type Props = {
  children?: React.ReactNode
}

const Header: React.FC<Props> = ({ children }) => {
  return (
    <AppBar position="sticky">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1 }}>
            <Link href="/" legacyBehavior>
              <a aria-label="Go to homepage">
                <Logo aria-hidden="true" />
              </a>
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
