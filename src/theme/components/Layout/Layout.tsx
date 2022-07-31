import React from 'react'
import Box from '@mui/material/Box'
import LayoutContext from './Context'
import { Drawers } from './Drawer'

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

export default Layout
