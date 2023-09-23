import { Remind } from '@icon-park/react'

import { Avatar, Badge, Space } from 'antd'

export const Header = () => {
  return (
    <div className="fixed top-0 min-w-full h-16 z-40 bg-umeHeader px-7 shadow-md">
      <div className="flex items-center justify-end flex-1 h-full align-middle">
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
