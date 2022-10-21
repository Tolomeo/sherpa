import React from 'react'
import { resourceTypes } from '../../data'
import { Chip } from '../theme'
import Icon from './Icon'

type Props = React.ComponentProps<typeof Chip> & {
  resourceType: keyof typeof resourceTypes
}
const ResourceTypeLabel = ({ resourceType, ...props }: Props) => {
  return (
    <Chip
      label={resourceType}
      size="small"
      icon={<Icon resourceType={resourceType} />}
      color="default"
      variant="outlined"
      {...props}
    />
  )
}

export default ResourceTypeLabel
