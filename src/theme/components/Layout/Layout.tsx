import React from 'react'
import Box from '@mui/material/Box'
import LayoutContext from './Context'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <LayoutContext>
      <Box>{children}</Box>
    </LayoutContext>
  )
}

export default Layout
