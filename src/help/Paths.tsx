import React from 'react'
import { Typography, Stack } from '../theme'

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

export default PathsHelp
