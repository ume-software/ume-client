import { Menu, Transition } from '@headlessui/react'
import { Dot, Gift, Logout, Remind, Search, Setting, User, WalletOne } from '@icon-park/react'
import { Button, Input } from '@ume/ui'
import coin from 'public/coin-icon.png'
import logo from 'public/ume-logo-2.svg'
import Notificate from '~/containers/notificate/notificate.container'

import React, { Fragment, ReactElement, ReactNode, useContext, useEffect, useRef, useState } from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'

import { SocketContext, SocketTokenContext, UserContext } from '../layouts/app-layout/app-layout'
import { LoginModal } from './login-modal.component'
import { RechargeModal } from './recharge-form.component'

import { trpc } from '~/utils/trpc'

interface HeaderProps {}

interface tabData {
  label: string
  children: ReactElement
}

export const Header: React.FC = ({}: HeaderProps) => {
  const [showSearh, setShowSearch] = useState(false)
  const [showRechargeModal, setShowRechargeModal] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [balance, setBalance] = useState<any>()
  const { socketToken, setSocketToken } = useContext(SocketTokenContext)
  const { userContext, setUserContext } = useContext(UserContext)
  const { socketContext } = useContext(SocketContext)
  const prevSocketContext = useRef<any[]>([])
  const [selectedTab, setSelectedTab] = useState('Chính')
  const [notificateIcon, setNotificatedIcon] = useState<ReactNode>(<Remind size={22} strokeWidth={4} fill="#FFFFFF" />)
  const [isModalLoginVisible, setIsModalLoginVisible] = React.useState(false)

  const { data: dataResponse, isLoading: loading, isFetching: fetching } = trpc.useQuery(['identity.identityInfo'])
  const {
    data: accountBalance,
    isLoading: loadingAccountBalance,
    isFetching: fetchingAccountBalance,
  } = trpc.useQuery(['identity.account-balance'], {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    onSuccess(data) {
      setBalance(data.data.totalCoinsAvailable)
    },
  })
  const responeBooking = trpc.useMutation(['booking.putProviderResponeBooking'])

  useEffect(() => {
    if (userInfo) {
      setSocketToken(window.localStorage.getItem('accessToken'))
    }
    if (dataResponse) {
      setUserInfo(dataResponse.data)
      setUserContext(dataResponse.data)
    }
  }, [dataResponse, setSocketToken, userInfo])

  useEffect(() => {
    if (socketContext.socketNotificateContext[0]?.id !== prevSocketContext.current?.[0]?.id) {
      setNotificatedIcon(
        <div onClick={() => setNotificatedIcon(<Remind size={22} strokeWidth={4} fill="#FFFFFF" />)}>
          <Remind theme="filled" size="22" fill="#FFFFFF" strokeLinejoin="bevel" />
          <Dot className="absolute top-0 right-0" theme="filled" size="18" fill="#FF0000" strokeLinejoin="bevel" />
        </div>,
      )
    } else {
      setNotificatedIcon(<Remind size={22} strokeWidth={4} fill="#FFFFFF" />)
    }
    prevSocketContext.current = socketContext.socketNotificateContext
  }, [socketContext])

  const tabDatas: tabData[] = [
    {
      label: `Chính`,
      children: <Notificate responeBooking={responeBooking} />,
    },
    {
      label: `Khác`,

      children: <div>Khac</div>,
    },
  ]

  const handleChangeTab = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = (e.target as HTMLElement).dataset.tab
    if (typeof target !== 'string') {
      return
    }
    setSelectedTab(target)
  }

  const handleSignout = (e) => {
    e.preventDefault()
  }

  const handleShowSearch = (e) => {
    e.preventDefault()
    setShowSearch(!showSearh)
  }

  return (
    <div className="fixed z-10 flex items-center justify-between w-full h-16 bg-umeHeader ">
      <LoginModal isModalLoginVisible={isModalLoginVisible} setIsModalLoginVisible={setIsModalLoginVisible} />
      <RechargeModal showRechargeModal={showRechargeModal} setShowRechargeModal={setShowRechargeModal} />
      <div className="flex items-center">
        <span className="pl-2">
          <Link href={'/home'}>
            <Image width={160} height={40} alt="logo-ume" src={logo} layout="fixed" />
          </Link>
        </span>
        <span className="px-3 py-2 text-lg font-medium text-white align-middle duration-500 hover:bg-slate-700 rounded-2xl hover:ease-in-out">
          <Link href={'/home'}>Trang chủ</Link>
        </span>
        <span className="px-3 py-2 text-lg font-medium text-white align-middle duration-500 hover:bg-slate-700 rounded-2xl hover:ease-in-out ">
          <Link href={'/live'}>Trực Tiếp</Link>
        </span>
        <span className="px-3 py-2 text-lg font-medium text-white align-middle duration-500 hover:bg-slate-700 rounded-2xl hover:ease-in-out">
          <Link href={'/community'}>Cộng đồng</Link>
        </span>
      </div>
      <div className="flex items-center">
        <div className="flex flex-1 pr-2 duration-500 hover:ease-in-out">
          <span className="my-auto mr-2">
            <Link href={'/register-provider'}>
              <Button
                name="register"
                customCSS="bg-[#37354F] py-1  hover:bg-slate-700 !rounded-3xl max-h-10 w-[160px] text-[15px] hover:ease-in-out"
                type="button"
              >
                Trở thành ume
              </Button>
            </Link>
          </span>
          <span className="self-center my-auto mr-4 rounded-ful hover:scale-110 hover:ease-in-out">
            <button className="pt-2">
              <Gift size={22} strokeWidth={4} fill="#FFFFFF" />
            </button>
          </span>
          <span className="flex flex-1 my-auto mr-4">
            {showSearh && (
              <Input
                className="outline-none border-none focus:outline-[#6d3fe0] max-h-8 rounded-2xl"
                placeholder="Search"
                onBlur={(e) => handleShowSearch(e)}
              />
            )}
            <button className={showSearh ? `hidden` : ``} onClick={(e) => handleShowSearch(e)}>
              <Search size={22} strokeWidth={4} fill="#FFFFFF" />
            </button>
          </span>
          {userInfo && accountBalance && (
            <button onClick={() => setShowRechargeModal(true)}>
              <div className="flex flex-1">
                <span className="rounded-full bg-[#37354F] p-1 self-center text-white"> {balance}</span>
                <span className="mt-2">
                  <Image src={coin} width={40} height={40} alt="coin" />
                </span>
              </div>
            </button>
          )}
          <span className="my-auto mr-5 duration-300 rounded-full">
            <div className="relative pt-2">
              <Menu>
                <div>
                  <Menu.Button>{notificateIcon}</Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-400"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-400"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 p-5 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg w-96 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="flex flex-row gap-10" style={{ zIndex: 2 }}>
                      {tabDatas.map((item, index) => (
                        <a
                          href="#tab"
                          className={`xl:text-lg text-md font-medium p-2 ${
                            item.label == selectedTab ? 'border-b-4 border-purple-700' : ''
                          }`}
                          key={index}
                          onClick={handleChangeTab}
                          data-tab={item.label}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                    <div className="p-3 overflow-auto h-96">
                      {tabDatas.map((item, index) => {
                        return (
                          <div key={index} hidden={selectedTab !== item.label}>
                            {item.children}
                          </div>
                        )
                      })}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </span>
          <span className="my-auto mr-5">
            {!userInfo ? (
              <>
                <Button
                  name="register"
                  customCSS="bg-[#37354F]  py-2 hover:bg-slate-500 duration-300 !rounded-3xl max-h-10 w-[120px] text-[15px] "
                  type="button"
                  onClick={() => {
                    setIsModalLoginVisible(true)
                  }}
                >
                  Đăng nhập
                </Button>
              </>
            ) : (
              <div className="mt-1 bg-[#292734]">
                <Menu>
                  <div>
                    <Menu.Button>
                      <Image
                        className="rounded-full"
                        layout="fixed"
                        height={35}
                        width={35}
                        src={userInfo?.avatarUrl.toString()}
                        alt="avatar"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-400"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-400"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute w-56 pt-2 origin-top-right bg-white divide-y divide-gray-200 rounded-md shadow-lg right-12 ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item as="div">
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-violet-500 text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <User theme="outline" size="20" fill="#333" className="mr-3" />
                            Tài khoản của bạn
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item as="div">
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-violet-500 text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <WalletOne theme="outline" size="20" fill="#333" className="mr-3" />
                            Kiểm tra ví tiên
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item as="div">
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-violet-500 text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <Setting theme="outline" size="20" fill="#333" className="mr-3" />
                            Cài đặt tài khoản
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item as="div">
                        {({ active }) => (
                          <Link
                            href={'/logout'}
                            className={`${
                              active ? 'bg-violet-500 text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <Logout className="mr-3" theme="outline" size="20" fill="#333" />
                            Đăng xuất
                          </Link>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
