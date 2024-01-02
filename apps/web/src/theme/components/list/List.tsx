import React from 'react'
import MuiList, { ListProps } from '@mui/material/List'

const List = ({ children, ...props }: ListProps) => {
  return <MuiList {...props}>{children}</MuiList>
}

export default List
