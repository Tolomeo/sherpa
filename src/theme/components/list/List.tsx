import React from 'react'
import MuiList, { ListProps } from '@mui/material/List'
import MuiListItem, {
  ListItemProps as MuiListItemProps,
} from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox'

const List = ({ children, ...props }: ListProps) => {
  return <MuiList {...props}>{children}</MuiList>
}

type ListItemProps = MuiListItemProps & {
  marker?: React.ReactNode
}

const ListItem = ({ children, marker, ...props }: ListItemProps) => (
  <MuiListItem {...props}>
    {marker && <ListItemIcon>{marker}</ListItemIcon>}
    <ListItemText primary={children} />
  </MuiListItem>
)

const ListItemBullet = () => <CircleOutlinedIcon sx={{ fontSize: 14 }} />

const ListItemCheckbox = (props: CheckboxProps) => (
  <Checkbox edge="start" size="small" {...props} />
)

ListItem.Bullet = ListItemBullet
ListItem.Checkbox = ListItemCheckbox

export { ListItem }
export default List
