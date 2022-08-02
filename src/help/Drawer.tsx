import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { ResourceTypes } from '../../data'
import {
  SubjectsIcon,
  IconButton,
  CloseIcon,
  LayoutDrawer,
  useLayoutDrawer,
} from '../theme'

const drawerName = 'help'

export const HelpDrawer: React.FC = ({ children }) => {
  return <LayoutDrawer name={drawerName}>{children}</LayoutDrawer>
}

export const HelpDrawerToggle = () => {
  const router = useRouter()
  const { toggle, isOpen, close } = useLayoutDrawer(drawerName)

  useEffect(() => {
    console.log(router.asPath, isOpen())
    close()
    if (isOpen()) close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  return (
    <IconButton color="inherit" aria-label="Toggle paths menu" onClick={toggle}>
      {isOpen() ? <CloseIcon /> : <SubjectsIcon />}
    </IconButton>
  )
}
