import * as React from 'react'
import Link from 'next/link'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import GitHubIcon from '@mui/icons-material/GitHub'
import Container from './Container'
import Logo from './Logo'

const GithubLink = () => {
  return (
    <Typography
      href={process.env.NEXT_PUBLIC_GITHUB_URL}
      color="inherit"
      textTransform="uppercase"
      component="a"
      sx={{
        textDecoration: 'none',
      }}
    >
      <GitHubIcon />
    </Typography>
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default ResponsiveAppBar
