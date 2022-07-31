import React from 'react'
import SubjectIcon from '@mui/icons-material/Subject'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Paths, SerializedPaths } from '../../data'
import { LayoutDrawer, useLayoutDrawer } from '../theme'
import PathsList from './List'

const drawerName = 'paths'

type Props = {
  paths: Paths | SerializedPaths
}

export const PathsDrawer: React.FC<Props> = ({ paths }) => (
  <LayoutDrawer name={drawerName}>
    <PathsList paths={paths} />
  </LayoutDrawer>
)

export const PathsDrawerToggle = () => {
  const { toggle, isOpen } = useLayoutDrawer(drawerName)

  return (
    <IconButton color="inherit" aria-label="Toggle paths menu" onClick={toggle}>
      {isOpen() ? <CloseIcon /> : <SubjectIcon />}
    </IconButton>
  )
}
