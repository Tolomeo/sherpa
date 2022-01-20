import * as React from 'react'
import Link from 'next/link'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import GitHubIcon from '@mui/icons-material/GitHub'

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

const Logo = () => (
  <Link href="/" passHref>
    <Typography
      sx={{
        textDecoration: 'none',
        borderBottom: '2px dashed currentColor',
      }}
      color="inherit"
      textTransform="uppercase"
      component="a"
      variant="h6"
      noWrap
    >
      The learning path
    </Typography>
  </Link>
)

const ResponsiveAppBar = () => {
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1 }}>
            <Logo />
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
