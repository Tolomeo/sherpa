import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
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
  const router = useRouter()
  const { toggle, isOpen, close } = useLayoutDrawer(drawerName)

  useEffect(() => {
    if (isOpen()) close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  return (
    <IconButton color="inherit" aria-label="Toggle help menu" onClick={toggle}>
      {isOpen() ? <CloseIcon /> : <PlaylistIcon />}
    </IconButton>
  )
}
