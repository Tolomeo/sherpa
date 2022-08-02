import React from 'react'
import MuiList from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'

type Props = {
  bulleted?: boolean
  spaced?: boolean
}

const List: React.FC<Props> = ({
  children,
  bulleted = true,
  spaced = true,
}) => {
  return (
    <MuiList disablePadding={!spaced}>
      {React.Children.map(
        children,
        (child) =>
          child && (
            <ListItem disableGutters={!spaced}>
              {bulleted && (
                <ListItemIcon>
                  <CircleOutlinedIcon sx={{ fontSize: 14 }} />
                </ListItemIcon>
              )}{' '}
              <ListItemText primary={child} />
            </ListItem>
          ),
      )}
    </MuiList>
  )
}

export default List
