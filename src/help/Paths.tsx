import React from 'react'
import { Typography, Stack } from '../theme'

const PathsHelp = () => (
  <Stack spacing={1}>
    <Typography>
      Every path in Sherpa could vary slightly depending on the differences
      among subjects and on their resources being designed by different authors,
      in different times and with different objectives in mind.
      <br />
      There are some recurring patterns nonetheless.
    </Typography>
    <Typography>
      When possible, paths will start with a <b>You want to come from</b>{' '}
      section, listing preparatory paths.
    </Typography>
    <Typography>
      The path itself is a list of resources, ordered in such a way to cover all
      the essentials, from beginner to intermediate/advanced level.
    </Typography>
    <Typography>
      The number of additional sections coming straight after can vary, but one
      will generally be able to find:
    </Typography>
    <Typography>
      <b>There&apos;s more</b> with alternative resources to the ones in the
      path
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
      <b>Great bookmarks</b> with references, cheatsheets and utility tools
    </Typography>
    <Typography>
      <b>Stay in the loop</b> with blogs, newletters and feeds to stay up to
      date
    </Typography>
    <Typography>
      When possible, paths will conclude with a <b>You could continue with</b>{' '}
      section, recommending next steps.
    </Typography>
  </Stack>
)

export default PathsHelp
