import { useMemo } from 'react'
import type { ResourceData } from '@sherpa/data/resource'
import { Link, Typography, Box, List, ListItem } from '../../theme'

const sortResourcesAlphabetically = (resources: ResourceData[]) =>
  [...resources].sort((resourceA, resourceB) => {
    const titleA = resourceA.data.title.toUpperCase()
    const titleB = resourceB.data.title.toUpperCase()

    if (titleA > titleB) return 1
    else if (titleA < titleB) return -1

    return 0
  })

interface Props {
  resources: ResourceData[]
}

const UnorderedResources = ({ resources }: Props) => {
  const alphabeticallySortedResources = useMemo(
    () => sortResourcesAlphabetically(resources),
    [resources],
  )

  return (
    <Box>
      <List>
        {alphabeticallySortedResources.map((resource) => (
          <ListItem marker={<ListItem.Bullet />} key={resource.url}>
            <Box>
              <Link href={resource.url} target="_blank" rel="noreferrer">
                <Typography variant="overline" color="text.secondary">
                  {resource.data.source}
                </Typography>
                <Typography
                  component="span"
                  variant="h6"
                  display="block"
                  gutterBottom
                >
                  {resource.data.title}
                </Typography>
              </Link>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default UnorderedResources
