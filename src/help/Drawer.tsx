import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  SubjectsIcon,
  IconButton,
  CloseIcon,
  LayoutDrawer,
  useLayoutDrawer,
} from '../theme'

const drawerName = 'help-drawer'
const drawerTestId = 'help-drawer'
const toggleTestId = 'help-drawer-toggle'

export const HelpDrawer: React.FC = ({ children }) => {
  return (
    <LayoutDrawer name={drawerName} data-testid={drawerTestId}>
      {children}
    </LayoutDrawer>
  )
}

export const HelpDrawerToggle = () => {
  const router = useRouter()
  const { toggle, isOpen, close } = useLayoutDrawer(drawerName)

  useEffect(() => {
    if (isOpen()) close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  return (
    <IconButton
      color="inherit"
      aria-label="Toggle menu"
      onClick={toggle}
      data-testid={toggleTestId}
    >
      {isOpen() ? <CloseIcon /> : <SubjectsIcon />}
    </IconButton>
  )
}
