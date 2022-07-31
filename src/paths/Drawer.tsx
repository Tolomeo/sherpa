import React from 'react'
import { Paths, SerializedPaths } from '../../data'
import {
  LayoutDrawer,
  useLayoutDrawer,
  IconButton,
  PlaylistIcon,
  CloseIcon,
  Typography,
  Stack,
} from '../theme'
import PathsList from './List'

const drawerName = 'paths'

type Props = {
  paths: Paths | SerializedPaths
}

export const PathsDrawer: React.FC<Props> = ({ paths }) => (
  <LayoutDrawer name={drawerName}>
    <Stack spacing={3}>
      <Typography variant="h5" component="p">
        Choose your path
      </Typography>
      <PathsList paths={paths} />
    </Stack>
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
