import { Menu, Space } from 'antd'
import Image from 'next/legacy/image'

import WhiteLogo from '../../../public/ico/ume-white.ico'
import SidebarNavigation from './sidebar-navigation'

const Sidebar = () => {
  return (
    <div className="fixed top-0 w-[21%] z-50 h-screen bg-umeHeader">
      <Space className="pt-3 w-full flex justify-center">
        <Image width={50} height={50} src={WhiteLogo} alt="logo" />
        <span className="text-5xl font-bold text-white">UME</span>
      </Space>
      <Menu
        theme="dark"
        defaultOpenKeys={['admin', 'account', 'skill', 'transaction', 'voucher']}
        mode="inline"
        items={SidebarNavigation}
      />
    </div>
  )
}

export default Sidebar
