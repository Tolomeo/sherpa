import React from 'react'
import { Resources } from '../../data'
import { Link, Typography, Box, List, ListItem } from '../theme'

type Props = {
  resources: Resources
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
                target="_blank"
                rel="noreferrer"
              >
                <Typography
                  data-testid={alternativesListItemTitleTestId}
                  component="span"
                  variant="h6"
                  display="block"
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

export default AlternateSourcesList
