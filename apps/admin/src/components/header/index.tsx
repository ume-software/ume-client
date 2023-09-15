import { MenuUnfoldOne, Remind } from '@icon-park/react'

import { Avatar, Badge, Space, Typography } from 'antd'
import Image from 'next/image'

import WhiteLogo from '../../../public/ico/ume-white.ico'

export const Header = () => {
  return (
    <div className="fixed top-0 w-full h-16 bg-umeHeader px-7 shadow-md">
      <div className="flex items-center justify-between flex-1 h-full align-middle">
        <Space>
          <Image width={50} height={50} src={WhiteLogo} alt="logo" />
          <span className="ml-3 mr-20 text-5xl font-bold text-white">UME</span>
          {/* <MenuUnfoldOne theme="outline" size="24" fill="#fff" /> */}
        </Space>
        <Space>
          <Badge size="small" count={20}>
            <Remind theme="outline" size="24" fill="#fff" />
          </Badge>
          <Avatar size={40} className="ml-5">
            Q
          </Avatar>
        </Space>
      </div>
    </div>
  )
}
