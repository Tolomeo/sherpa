import React, { useEffect, useRef } from 'react'
import { useLayoutContext } from '../Context'

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

type Props = {
  name: string
}

const Drawer: React.FC<Props> = ({ name, children }) => {
  const drawerName = useRef(name)
  const { registerDrawer, unregisterDrawer, setDrawer } = useLayoutContext()

  useEffect(() => {
    unregisterDrawer(drawerName.current)
    drawerName.current = name
    registerDrawer(drawerName.current, children)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  useEffect(() => {
    setDrawer(drawerName.current, { children })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children])

  useEffect(() => {
    const cleanupDrawerName = drawerName.current
    return () => unregisterDrawer(cleanupDrawerName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default Drawer
