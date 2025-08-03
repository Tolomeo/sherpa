import type { ResourceData } from '@sherpa/data/resource'
import { Link, Typography, Box, List, ListItem } from '../theme'

interface Props {
  resources: ResourceData[]
}

const alternativesListTestId = 'alternatives.list'
const alternativesListItemTestId = 'alternatives.list.item'
const alternativesListItemLinkTestId = 'alternatives.list.item.link'
const alternativesListItemTitleTestId = 'alternatives.list.item.title'

const AlternateSourcesList = ({ resources }: Props) => {
  return (
    <Box data-testid={alternativesListTestId}>
      <List>
        {Object.entries(resources).map(([resourceId, resource]) => (
          <ListItem key={resourceId}>
            <Box data-testid={alternativesListItemTestId}>
              <Link
                data-testid={alternativesListItemLinkTestId}
                href={resource.url}
                rel="noreferrer"
                target="_blank"
              >
                <Typography
                  component="span"
                  data-testid={alternativesListItemTitleTestId}
                  display="block"
                  variant="h6"
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

export default AlternateSourcesList
