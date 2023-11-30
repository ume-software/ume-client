import { HamburgerButton } from '@icon-park/react'
import emptyPic from 'public/empty_error.png'
import WhiteTextLogo from 'public/ume-logo-2.png'
import { useAuth } from '~/contexts/auth'
import { getItem, removeItem } from '~/hooks/localHooks'
import useWindowDimensions from '~/hooks/windownDimensions'

import { useCallback, useEffect } from 'react'

import { Dropdown } from 'antd'
import Cookies from 'js-cookie'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'

export interface IHeaderProps {
  handleOpen?: any
  openSideBar?: boolean
  setOpenPopupSideBar?: any
  openPopupSideBar?: boolean
}

export const Header = ({ handleOpen, openSideBar, setOpenPopupSideBar, openPopupSideBar }: IHeaderProps) => {
  const router = useRouter()
  const { width } = useWindowDimensions()

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
      label: <div className="w-full p-2 text-white rounded-lg hover:bg-gray-600 active:bg-gray-500">Đăng xuất</div>,
    },
  ]

  const adminInfo = getItem('user')

  useEffect(() => {
    if (adminInfo) {
      login(adminInfo)
    }
    if (!Cookies.get('accessToken')) {
      handleLogOut()
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

  function handleOpenSideBar() {
    if (width <= 900) {
      setOpenPopupSideBar(!openPopupSideBar)
    } else handleOpen()
  }
  return (
    <div
      className={`fixed top-0 w-full h-16 z-40 bg-umeHeader pr-7 ${
        width <= 900 ? 'pl-7%' : !openSideBar || width <= 1200 ? 'pl-[9%]' : 'pl-[21%]'
      } shadow-md`}
    >
      <div className="flex items-center justify-between flex-1 h-full align-middle">
        <div onClick={handleOpenSideBar} className="p-1 rounded-full cursor-pointer hover:bg-gray-500">
          <HamburgerButton theme="outline" size="22" fill="#fff" />
        </div>
        {width <= 900 && (
          <div className="">
            <Image width={100} height={35} src={WhiteTextLogo} alt="logo" />
          </div>
        )}
        <div className="flex justify-end items-center">
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
        </div>
      </div>
    </div>
  )
}
