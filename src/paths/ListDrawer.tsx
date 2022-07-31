import React from 'react'
import SubjectIcon from '@mui/icons-material/Subject'
import IconButton from '@mui/material/IconButton'
import { LayoutDrawer, useLayoutDrawer } from '../theme'

// type Props = {
//   paths: Paths | SerializedPaths
// }
const drawerName = 'paths-list'

export const PathsListDrawer = () => (
  <LayoutDrawer name={drawerName}>paths list content</LayoutDrawer>
)

export const PathsListDrawerToggle = () => {
  const { toggle } = useLayoutDrawer(drawerName)

  return (
    <IconButton color="inherit" aria-label="Open drawer" onClick={toggle}>
      <SubjectIcon />
    </IconButton>
  )
}

export default PathsListDrawerToggle
