import React from 'react'
import type { ListProps } from '@mui/material/List'
import MuiList from '@mui/material/List'

const List = ({ children, ...props }: ListProps) => {
  return <MuiList {...props}>{children}</MuiList>
}

export default List
