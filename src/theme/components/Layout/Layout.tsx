import React from 'react'
import Box from '@mui/material/Box'
import LayoutContext, { useLayoutContext } from './Context'
import Header from './Header'
import Container from './Container'
import Hero from './Hero'
import Villain from './Villain'
import Drawer from './Drawer'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <LayoutContext>
      <Box>{children}</Box>
      <Drawer />
    </LayoutContext>
  )
}

Layout.Header = Header
Layout.Container = Container
Layout.Hero = Hero
Layout.Villain = Villain
export default Layout
