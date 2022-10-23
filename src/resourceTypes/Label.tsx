import React from 'react'
import { resourceTypes } from '../../data'
import { Chip, Stack, Typography } from '../theme'
import Icon from './Icon'

type Props = React.ComponentProps<typeof Chip> & {
  resourceType: keyof typeof resourceTypes
}
const ResourceTypeLabel = ({ resourceType }: Props) => {
  return (
    <Stack direction="row" spacing={0.5}>
      <Icon resourceType={resourceType} />
      <Typography variant="body2" color="text.secondary">
        {resourceType}
      </Typography>
    </Stack>
  )
}

export default ResourceTypeLabel
