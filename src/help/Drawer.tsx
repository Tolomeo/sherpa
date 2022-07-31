import React from 'react'
import { ResourceTypes } from '../../data'
import {
  HelpIcon,
  IconButton,
  CloseIcon,
  LayoutDrawer,
  useLayoutDrawer,
} from '../theme'
import ResourceTypesList from './ResourceTypes'

const drawerName = 'help'

type Props = {
  resourceTypes: ResourceTypes
}

export const HelpDrawer: React.FC<Props> = ({ resourceTypes }) => (
  <LayoutDrawer name={drawerName}>
    <ResourceTypesList resourceTypes={resourceTypes} />
  </LayoutDrawer>
)

export const HelpDrawerToggle = () => {
  const { toggle, isOpen } = useLayoutDrawer(drawerName)

  return (
    <IconButton color="inherit" aria-label="Toggle paths menu" onClick={toggle}>
      {isOpen() ? <CloseIcon /> : <HelpIcon />}
    </IconButton>
  )
}
