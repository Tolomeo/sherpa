import React from 'react'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import SubjectsIcon from '@mui/icons-material/Subject'
import { useLayoutContext } from '../Context'

type Props = Omit<IconButtonProps, 'children'>

const DrawerToggle: React.FC<Props> = (props) => {
  const { drawerOpen, toggleDrawer } = useLayoutContext()

  return (
    <IconButton
      color="inherit"
      aria-label="Toggle menu"
      {...props}
      // data-testid={toggleTestId}
      onClick={toggleDrawer}
    >
      {drawerOpen ? <CloseIcon /> : <SubjectsIcon />}
    </IconButton>
  )
}

export default DrawerToggle
