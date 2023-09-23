import React from 'react'
import MuiList, { ListProps } from '@mui/material/List'
import MuiListItem, { ListItemProps } from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'

const List = ({ children, ...props }: ListProps) => {
  return <MuiList {...props}>{children}</MuiList>
}

export const ListItem = ({ children, ...props }: ListItemProps) => (
  <MuiListItem {...props}>
    <ListItemIcon>
      <CircleOutlinedIcon sx={{ fontSize: 14 }} />
    </ListItemIcon>
    <ListItemText primary={children} />
  </MuiListItem>
)

export default List
