import { Menu, Transition } from '@headlessui/react'
import { Dot, Gift, Logout, Remind, Search, Setting, User, WalletOne } from '@icon-park/react'
import { Button, Input } from '@ume/ui'
import coin from 'public/coin-icon.png'
import logo from 'public/ume-logo-2.svg'
import Notificate from '~/containers/notificate/notificate.container'
import { useAuth } from '~/contexts/auth'

import React, { Fragment, ReactElement, useContext, useEffect, useId, useState } from 'react'

import { parse } from 'cookie'
import Image from 'next/legacy/image'
import Link from 'next/link'

import { SocketTokenContext, UserContext } from '../layouts/app-layout/app-layout'
import { LoginModal } from './login-modal.component'
import { RechargeModal } from './recharge-form.component'

import { trpc } from '~/utils/trpc'

interface HeaderProps {}

interface TabProps {
  label: string
  children: ReactElement
}

export const Header: React.FC = ({}: HeaderProps) => {
  const index = useId()
  const [showRechargeModal, setShowRechargeModal] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [balance, setBalance] = useState<any>()
  const [notificatedAmount] = useState<number>(0)
  const { setSocketToken } = useContext(SocketTokenContext)
  const { userContext, setUserContext } = useContext(UserContext)
  const [selectedTab, setSelectedTab] = useState('Chính')
  const [isModalLoginVisible, setIsModalLoginVisible] = React.useState(false)
  const accessToken = parse(document.cookie).accessToken
  const { isAuthenticated } = useAuth()

  const { isLoading: loadingBalance } = trpc.useQuery(['identity.account-balance'], {
    onSuccess(data) {
      setBalance(data.data.totalCoinsAvailable)
    },
    enabled: isAuthenticated,
  })

  useEffect(() => {
    if (userInfo) {
      setSocketToken(accessToken || null)
    }
  }, [setSocketToken, userInfo, accessToken])

  const tabDatas: TabProps[] = [
    {
      label: `Chính`,
      children: <Notificate type={'main'} />,
    },
    {
      label: `Đơn`,
      children: <Notificate type={'order'} />,
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

          {isAuthenticated && balance && !loadingBalance && (
            <button onClick={() => setShowRechargeModal(true)}>
              <div className="flex items-center justify-end rounded-full bg-[#37354F] px-2 mr-2 self-center text-white">
                <p className="text-lg font-semibold">{balance}</p>
                <Image src={coin} width={30} height={30} alt="coin" />
              </div>
            </button>
          )}
          <span className="my-auto mr-5 duration-300 rounded-full">
            <div className="relative pt-2">
              <Menu>
                <div>
                  <Menu.Button>
                    {notificatedAmount > 0 ? (
                      <div>
                        <Remind theme="filled" size="22" fill="#FFFFFF" strokeLinejoin="bevel" />
                        <Dot
                          className="absolute top-0 right-0"
                          theme="filled"
                          size="18"
                          fill="#FF0000"
                          strokeLinejoin="bevel"
                        />
                      </div>
                    ) : (
                      <Remind size={22} strokeWidth={4} fill="#FFFFFF" />
                    )}
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
                  <Menu.Items className="absolute right-0 p-5 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg w-96 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="flex flex-row gap-10" style={{ zIndex: 2 }}>
                      {tabDatas.map((item) => (
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
                      {tabDatas.map((item) => {
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
            {!isAuthenticated ? (
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
                          <Link
                            href={`/account-setting?user=${userContext?.name}`}
                            className={`${
                              active ? 'bg-violet-500 text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <Setting theme="outline" size="20" fill="#333" className="mr-3" />
                            Cài đặt tài khoản
                          </Link>
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
