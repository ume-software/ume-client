import { Remind } from '@icon-park/react'
import emptyPic from 'public/empty_error.png'
import { useAuth } from '~/contexts/auth'
import { getItem, removeItem } from '~/hooks/localHooks'

import { useCallback, useEffect } from 'react'

import { Badge, Dropdown, Space } from 'antd'
import { log } from 'console'
import Cookies from 'js-cookie'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'

export const Header = () => {
  const router = useRouter()
  const { user, login, logout } = useAuth()

  const handleLogOut = useCallback(() => {
    removeItem('user')
    Cookies.remove('refreshToken')
    Cookies.remove('accessToken')
    logout()
    router.push('/signin')
  }, [router, logout])

  const items = [
    {
      key: 'logOut',
      label: <div className="p-2 text-white active:bg-gray-500">Đăng xuất</div>,
    },
  ]

  const adminInfo = getItem('user')

  useEffect(() => {
    if (adminInfo) {
      login(adminInfo)
    }

    if (!user && !adminInfo) {
      handleLogOut()
    }
  }, [])

  const handleItemSelected = (e) => {
    switch (e.key) {
      case 'logOut':
        handleLogOut()
        break
    }
  }
  return (
    <div className="fixed top-0 z-40 h-16 min-w-full shadow-md bg-umeHeader px-7">
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
            <div>
              <Image
                className="rounded-full"
                src={adminInfo?.avatarUrl || emptyPic}
                width={40}
                height={40}
                alt="Picture of the author"
              />
            </div>
          </Dropdown>
        </Space>
      </div>
    </div>
  )
}
