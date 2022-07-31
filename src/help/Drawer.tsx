import React from 'react'
import HelpIcon from '@mui/icons-material/Help'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { LayoutDrawer, useLayoutDrawer } from '../theme'

const drawerName = 'help'

type Props = {}

export const HelpDrawer: React.FC<Props> = () => (
  <LayoutDrawer name={drawerName}>eheheheheh</LayoutDrawer>
)

export const HelpDrawerToggle = () => {
  const { toggle, isOpen } = useLayoutDrawer(drawerName)

  return (
    <IconButton color="inherit" aria-label="Toggle paths menu" onClick={toggle}>
      {isOpen() ? <CloseIcon /> : <HelpIcon />}
    </IconButton>
  )
}
