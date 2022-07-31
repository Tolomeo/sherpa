import React, { useEffect } from 'react'
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
  const { registerDrawer, unregisterDrawer } = useLayoutContext()
  useEffect(() => {
    registerDrawer(name, children)
    return () => unregisterDrawer(name)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default Drawer
