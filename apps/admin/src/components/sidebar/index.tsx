import { Menu, Space } from 'antd'
import Image from 'next/legacy/image'

import WhiteLogo from '../../../public/ume-logo-2.png'
import SidebarNavigation from './sidebar-navigation'

const Sidebar = () => {
  return (
    <div className="fixed top-0 w-[21%] z-50 h-screen bg-umeHeader">
      <Space className="pt-3 w-full flex justify-center mb-4">
        <Image width={150} height={50} src={WhiteLogo} alt="logo" />
      </Space>
      <Menu
        theme="dark"
        defaultOpenKeys={['admin', 'account', 'service', 'transaction', 'voucher']}
        mode="inline"
        items={SidebarNavigation}
      />
    </div>
  )
}

export default Sidebar
