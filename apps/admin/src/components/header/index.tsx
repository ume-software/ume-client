import { Remind } from '@icon-park/react'
import emptyPic from 'public/empty_error.png'
import { getItem, removeItem } from '~/hooks/localHooks'

import { useEffect } from 'react'

import { Badge, Dropdown, Space } from 'antd'
import Cookies from 'js-cookie'
import Image from 'next/legacy/image'
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

  useEffect(() => {
    if (adminInfo) {
      return
    } else {
      handleLogOut()
    }
  }, [adminInfo])

  const test = {
    id: '93ac1c91-8660-4589-b559-8222fbab9d1b',
    createdAt: '2023-09-25T03:17:53.350Z',
    updatedAt: '2023-09-25T03:17:53.350Z',
    deletedAt: null,
    name: 'Vo Van Que',
    username: 'queadmin',
    dob: '2001-05-31T17:00:00.000Z',
    gender: 'MALE',
    phone: '0123456789',
    email: 'shinamonvu@gmail.com',
    password: '$2b$10$yLZVOWv1px8mreKT4jXzEOQwgYFrXv.3kdhxFqu0dag2virW4D6WW',
    avatarUrl: 'https://haycafe.vn/wp-content/uploads/2022/02/anh-meo-cute-hinh-cute-meo.jpg',
    ipv4: null,
  }

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
