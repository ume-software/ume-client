import { Logout } from '@icon-park/react'
import { Button } from '@ume/ui'

import { useState } from 'react'

import { Menu } from 'antd'
import Image from 'next/legacy/image'

import SidebarNavigation from './sidebar-navigation'

interface ISidebar {}
const Sidebar = ({}: ISidebar) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="fixed top-0 w-[18%] mt-16 h-screen bg-gray-800">
      <Menu
        theme="dark"
        defaultOpenKeys={['admin', 'account', 'skill', 'deposit']}
        mode="inline"
        items={SidebarNavigation}
      />
    </div>
  )
}

export default Sidebar
