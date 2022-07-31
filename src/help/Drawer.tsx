import React from 'react'
import { ResourceTypes } from '../../data'
import {
  Box,
  Chip,
  HelpIcon,
  IconButton,
  CloseIcon,
  LayoutDrawer,
  useLayoutDrawer,
  Typography,
  Stack,
} from '../theme'
import ResourceTypesList from './ResourceTypes'

const drawerName = 'help'

type Props = {
  resourceTypes: ResourceTypes
}

const PathsHelp = () => (
  <Stack spacing={1}>
    <Typography>
      Every path in Sherpa could vary slightly. That is due to the differences
      among subjects covered, but also due to resources being originally
      designed by different authors, in different times and with different
      objectives.
      <br />
      One will be able to find a few recurring patterns nonetheless.
    </Typography>
    <Typography>
      First of all, and if possible, paths will start with a{' '}
      <b>You want to come from</b> section, listing any other path which could
      be useful following before tackling them.
    </Typography>
    <Typography>
      The path itself is represented by a list of resources, ordered in a way to
      cover all topic’s essentials from beginner to intermediate/advanced level.
    </Typography>
    <Typography>
      The number of additional sections which follow can vary, but one will
      generally be able to find:
    </Typography>
    <Typography>
      <b>There&apos;s more</b> with alternative resources to the ones listed by
      the path core
    </Typography>
    <Typography>
      <b>Beyond basics</b> with advanced topics and in-depth analyses
    </Typography>
    <Typography>
      <b>How do they do it?</b> with example projects to get inspiration from
    </Typography>
    <Typography>
      <b>Nice to know</b> with curiosities and contextual information
    </Typography>
    <Typography>
      <b> Great bookmarks</b> with references, cheatsheets and utility tools
    </Typography>
    <Typography>
      <b> Stay in the loop</b> with blogs, newletters and feeds to stay up to
      date
    </Typography>
    <Typography>
      If possible, paths will conclude with a <b>You could continue with</b>{' '}
      section, listing other paths which could be interesting to follow after
      completing them.
    </Typography>
  </Stack>
)

const ResourcesHelp = ({ resourceTypes }: Props) => (
  <Stack spacing={1}>
    <Typography>
      Every resource is marked with a label indicating its type.
      <br />
      That is useful to have an idea of the structure of the resource itself and
      the learning goals it provides help with. A resource can have more than
      one type assigned.
    </Typography>
    <Typography>
      The resource type provides indication of how a resource can help:
    </Typography>
    {Object.entries(resourceTypes).map(([resourceTypeId, resourceType]) => (
      <Box key={resourceTypeId}>
        <Chip
          // data-testid={timelineItemTypeTestId}
          label={resourceType.title}
          size="small"
        />{' '}
        <Typography component="span">{resourceType.description}</Typography>
      </Box>
    ))}
    <Typography>
      As an advice to beginners: the paths’s core resources are just suggestions
      and there are plenty of alternatives found in the <b>There&apos;s more</b>{' '}
      section of every path. One could find themselves more comfortable swapping
      one or more core resources with alternative ones.
    </Typography>
    <Typography>
      Finally, some resources could present overlapping or repetition at times.
      One could decide to take only what fit best with their learning needs.
    </Typography>
  </Stack>
)

export const HelpDrawer: React.FC<Props> = ({ resourceTypes }) => (
  <LayoutDrawer name={drawerName}>
    <Stack spacing={3}>
      <Typography variant="h5" component="p">
        Need Help?
      </Typography>
      <Stack spacing={2}>
        <Typography variant="h6" component="p">
          Paths
        </Typography>
        <PathsHelp />
        <Typography variant="h6" component="p">
          Resources
        </Typography>
        <ResourcesHelp resourceTypes={resourceTypes} />
      </Stack>
    </Stack>
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
