import React from 'react'
import { Resource } from '../../data'
import {
  Link,
  Typography,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  Box,
  Stack,
  Chip,
} from '../theme'

type Props = {
  resources: Resource[]
}

const ResourcesTimeline = ({ resources }: Props) => {
  return (
    <Timeline position="right">
      {Object.values(resources).map((resource, index) => (
        <TimelineItem key={resource.url}>
          <TimelineSeparator>
            <TimelineConnector
              sx={{
                backgroundColor:
                  index === 0 ? 'background.default' : 'text.grey.400',
              }}
            />
            <TimelineDot variant="outlined" />
            <TimelineConnector
              sx={{
                backgroundColor:
                  index === resources.length - 1
                    ? 'background.default'
                    : 'text.grey.400',
              }}
            />
          </TimelineSeparator>
          <TimelineContent>
            <Box pt={1.5}>
              <Link href={resource.url} target="_blank" rel="noreferrer">
                <Typography variant="overline" color="text.secondary">
                  {resource.source}
                </Typography>
                <Box pb={1.5}>
                  <Typography component="span" variant="h6">
                    {resource.title}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  {resource.type.map((type) => (
                    <Chip key={type} label={type} size="small" />
                  ))}
                </Stack>
              </Link>
            </Box>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

export default ResourcesTimeline
