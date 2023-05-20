import { useState } from 'react'

import { Drawer } from 'antd'

interface DrawerSidebarProps {
  classNameButton?: string
  childrenButton: React.ReactNode
  titleDrawer?: React.ReactNode
  classNameDrawer?: string
  childrenDrawer?: React.ReactNode
  [key: string]: any
}

export const DrawerSidebar = ({
  classNameButton,
  childrenButton,
  titleDrawer,
  classNameDrawer,
  childrenDrawer,
  ...props
}: DrawerSidebarProps) => {
  const [open, setOpen] = useState(false)

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }
  return (
    <>
      <div className={`classNameButton`} onClick={showDrawer}>
        {childrenButton}
      </div>
      <Drawer
        className={`classNameDrawer`}
        title={titleDrawer}
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      >
        {childrenDrawer}
      </Drawer>
    </>
  )
}
