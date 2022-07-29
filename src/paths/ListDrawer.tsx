import React from 'react'
import SubjectIcon from '@mui/icons-material/Subject'
import IconButton from '@mui/material/IconButton'
// import { Paths, SerializedPaths } from '../../data'
import { useLayoutDrawer } from '../theme'

// type Props = {
//   paths: Paths | SerializedPaths
// }

const PathsListDrawerToggle = () => {
  const { toggle } = useLayoutDrawer('paths-list')

  return (
    <IconButton color="inherit" aria-label="Open drawer" onClick={toggle}>
      <SubjectIcon />
    </IconButton>
  )
}

export default PathsListDrawerToggle
