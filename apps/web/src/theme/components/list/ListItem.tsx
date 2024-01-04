import React from 'react'
import type {
  ListItemProps as MuiListItemProps,
} from '@mui/material/ListItem';
import MuiListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import type { CheckboxProps } from '@mui/material/Checkbox';
import Checkbox from '@mui/material/Checkbox'

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
  <Checkbox edge="start" size="small" sx={{ color: 'grey.400' }} {...props} />
)

ListItem.Bullet = ListItemBullet
ListItem.Checkbox = ListItemCheckbox

export default ListItem
