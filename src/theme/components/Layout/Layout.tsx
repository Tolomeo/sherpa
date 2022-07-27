import React from 'react'
import Box from '@mui/material/Box'
import Header from './Header'
import Container from './Container'
import Hero from './Hero'
import Villain from './Villain'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => <Box>{children}</Box>

Layout.Header = Header
Layout.Container = Container
Layout.Hero = Hero
Layout.Villain = Villain
export default Layout
