import React from 'react'
import Box from '@mui/material/Box'
import LayoutContext from './Context'
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
    </LayoutContext>
  )
}

Layout.Header = Header
Layout.Container = Container
Layout.Hero = Hero
Layout.Villain = Villain
Layout.Drawer = Drawer
export default Layout
