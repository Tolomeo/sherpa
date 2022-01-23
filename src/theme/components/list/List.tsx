import React from 'react'
import MuiList from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'

const List: React.FC = ({ children }) => {
  return (
    <MuiList>
      {React.Children.map(
        children,
        (child) =>
          child && (
            <ListItem>
              <ListItemIcon>
                <CircleOutlinedIcon sx={{ fontSize: 14 }} />
              </ListItemIcon>
              <ListItemText primary={child} />
            </ListItem>
          ),
      )}
    </MuiList>
  )
}

export default List
