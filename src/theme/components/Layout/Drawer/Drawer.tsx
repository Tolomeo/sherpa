import React, { useLayoutEffect } from 'react'
import { useLayoutContext } from '../Context'

export const useLayoutDrawer = (name: string) => {
  const { getDrawer, setDrawer, registerDrawer, unregisterDrawer } =
    useLayoutContext()
  const isOpen = () => Boolean(getDrawer(name))
  const open = () => setDrawer(name, true)
  const close = () => setDrawer(name, false)
  const toggle = () => setDrawer(name, !getDrawer(name))

  useLayoutEffect(() => {
    registerDrawer(name)
    return () => unregisterDrawer(name)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

const Drawer: React.FC<Props> = ({ name }) => {
  const { registerDrawer, unregisterDrawer } = useLayoutContext()
  useLayoutEffect(() => {
    registerDrawer(name)
    return () => unregisterDrawer(name)
  }, [name, registerDrawer, unregisterDrawer])

  return null
}

export default Drawer
