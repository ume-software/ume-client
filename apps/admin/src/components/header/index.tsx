import { Remind, User } from '@icon-park/react'
import emptyPic from 'public/empty_error.png'
import { getItem, removeItem } from '~/hooks/localHooks'

import { useEffect, useState } from 'react'

import { Avatar, Badge, Dropdown, Space } from 'antd'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

export const Header = () => {
  const router = useRouter()
  function handleLogOut() {
    removeItem('user')
    Cookies.remove('refreshToken')
    Cookies.remove('accessToken')
    router.push('/signin')
  }
  const items = [
    {
      key: 'logOut',
      label: <div className="active:bg-gray-500 text-white p-2">Đăng xuất</div>,
    },
  ]
  const adminInfo = getItem('user')

  const handleItemSelected = (e) => {
    switch (e.key) {
      case 'logOut':
        handleLogOut()
        break
    }
  }
  return (
    <div className="fixed top-0 min-w-full h-16 z-40 bg-umeHeader px-7 shadow-md">
      <div className="flex items-center justify-end flex-1 h-full align-middle">
        <Space>
          <div className="mr-5">
            <Badge size="small" count={20}>
              <Remind theme="outline" size="24" fill="#fff" />
            </Badge>
          </div>

          <Dropdown
            menu={{
              items,
              onClick: handleItemSelected,
            }}
            placement="bottomLeft"
          >
            <Avatar
              src={adminInfo?.avatarUrl}
              icon={
                <div className="w-full h-full flex justify-center items-center">
                  <User theme="outline" size="24" fill="#fff" />
                </div>
              }
              size={40}
            />
          </Dropdown>
        </Space>
      </div>
    </div>
  )
}
