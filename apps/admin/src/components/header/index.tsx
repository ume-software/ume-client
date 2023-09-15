import { Label, MenuUnfoldOne } from '@icon-park/react'

import { Avatar, Badge, Space, Typography } from 'antd'
import Image from 'next/image'

import WhiteLogo from '../../../public/ico/ume-white.ico'

export const Header = () => {
  return (
    <div className="fixed top-0 z-50 w-full h-16 bg-gray-800 shadow-md px-7">
      <div className="flex items-center justify-between flex-1 h-full align-middle">
        <Space>
          <Image width={50} height={50} src={WhiteLogo} alt="logo" />
          <span className="ml-3 mr-20 text-5xl font-bold text-white">UME</span>
          {/* <MenuUnfoldOne theme="outline" size="24" fill="#fff" /> */}
        </Space>
        <Space>
          <Badge size="small" count={20}>
            <Label theme="outline" size="24" fill="#fff" />
          </Badge>
          <Avatar size={40} className="ml-5">
            Q
          </Avatar>
        </Space>
      </div>
    </div>
  )
}
