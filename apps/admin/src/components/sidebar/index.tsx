import { Logout } from '@icon-park/react'
import { Button } from '@ume/ui'

import { useState } from 'react'

import { Menu, Space } from 'antd'
import Image from 'next/legacy/image'

import WhiteLogo from '../../../public/ico/ume-white.ico'
import SidebarNavigation from './sidebar-navigation'

interface ISidebar {}
const Sidebar = ({}: ISidebar) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="fixed top-0 w-[18%] z-50 h-screen bg-umeHeader">
      <Space className="pt-3 w-full flex justify-center">
        <Image width={50} height={50} src={WhiteLogo} alt="logo" />
        <span className="text-5xl font-bold text-white">UME</span>
        {/* <MenuUnfoldOne theme="outline" size="24" fill="#fff" /> */}
      </Space>
      <Menu
        theme="dark"
        defaultOpenKeys={['admin', 'account', 'service', 'deposit']}
        mode="inline"
        items={SidebarNavigation}
      />
    </div>
  )
}

export default Sidebar
