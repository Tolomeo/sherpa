import React, { useEffect, useRef } from 'react'
import { useLayoutContext } from '../Context'
import { DrawerProps } from '@mui/material/Drawer'

export const useLayoutDrawer = (name: string) => {
  const { getDrawer, setDrawer } = useLayoutContext()
  const isOpen = () => Boolean(getDrawer(name)?.open)
  const open = () => setDrawer(name, { open: true })
  const close = () => setDrawer(name, { open: false })
  const toggle = () => setDrawer(name, { open: !getDrawer(name)?.open })

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}

type Props = DrawerProps & {
  name: string
}

const Drawer: React.FC<Props> = ({ name, ...props }) => {
  const drawerName = useRef(name)
  const { registerDrawer, unregisterDrawer, setDrawer } = useLayoutContext()

  useEffect(() => {
    unregisterDrawer(drawerName.current)
    drawerName.current = name
    registerDrawer(drawerName.current, props)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  useEffect(() => {
    setDrawer(drawerName.current, props)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  useEffect(() => {
    const cleanupDrawerName = drawerName.current
    return () => unregisterDrawer(cleanupDrawerName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default Drawer
