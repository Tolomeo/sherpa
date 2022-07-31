import React from 'react'
import { Paths, SerializedPaths } from '../../data'
import {
  LayoutDrawer,
  useLayoutDrawer,
  IconButton,
  PlaylistIcon,
  CloseIcon,
} from '../theme'
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
    <IconButton color="inherit" aria-label="Toggle help menu" onClick={toggle}>
      {isOpen() ? <CloseIcon /> : <PlaylistIcon />}
    </IconButton>
  )
}
