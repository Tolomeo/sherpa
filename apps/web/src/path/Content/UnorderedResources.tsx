import type { Resource } from '@sherpa/data/types'
import { Link, Typography, Box, List, ListItem } from '../../theme'

interface Props {
  resources: Resource[]
}

const UnorderedResources = ({ resources }: Props) => {
  return (
    <Box>
      <List>
        {resources.map((resource) => (
          <ListItem marker={<ListItem.Bullet />} key={resource.url}>
            <Box>
              <Link href={resource.url} target="_blank" rel="noreferrer">
                <Typography variant="overline" color="text.secondary">
                  {resource.source}
                </Typography>
                <Typography
                  component="span"
                  variant="h6"
                  display="block"
                  gutterBottom
                >
                  {resource.title}
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
