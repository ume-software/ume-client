import { Menu, Transition } from '@headlessui/react'
import { CloseSmall, Gift, Search } from '@icon-park/react'
import { Button, Modal } from '@ume/ui'
import logo from 'public/ume-logo-2.svg'

import React, { useState } from 'react'
import { Fragment } from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'

import { AuthForm } from './auth-form.component'

import { trpc } from '~/utils/trpc'

interface HeaderProps {}
export const Header: React.FC = ({}: HeaderProps) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const { data: userInfo, isLoading: loading, isFetching: fetching } = trpc.useQuery(['identity.identityInfo'])
  const handleClose = () => {
    setIsModalVisible(false)
  }

  const loginModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    show: isModalVisible,
    form: <AuthForm setShowModal={setIsModalVisible} />,
    backgroundColor: '#15151b',
    closeButtonOnConner: (
      <>
        <CloseSmall
          onClick={handleClose}
          onKeyDown={(e) => e.key === 'Enter' && handleClose()}
          tabIndex={1}
          className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
          theme="outline"
          size="24"
          fill="#FFFFFF"
        />
      </>
    ),
  })
  const handleSignout = (e) => {
    e.preventDefault()
  }
  return (
    <div className="fixed z-10 flex items-center justify-between w-full h-16 bg-umeHeader ">
      {loginModal}
      <div className="flex items-center">
        <span className="pl-6">
          <Link href={'/'}>
            <Image width={160} height={40} alt="logo-ume" src={logo} layout="fixed" />
          </Link>
        </span>
        <span className="mr-6 text-xl font-semibold text-white align-middle hover:scale-105 hover:ease-in-out font-francois">
          <Link href={'/'}>Trang chủ</Link>
        </span>
        <span className="mr-6 text-xl font-semibold text-white align-middle hover:scale-105 hover:ease-in-out font-francois ">
          <Link href={'/'}>Tạo phòng</Link>
        </span>
        <span className="text-xl font-semibold text-white align-middle hover:scale-105 hover:ease-in-out font-francois">
          <Link href={'/'}>Cộng đồng</Link>
        </span>
      </div>
      <div className="flex items-center">
        <div className="flex pr-6 flex-row-auto">
          <span className="mr-5">
            <Button
              name="register"
              customCSS="bg-[#37354F] py-2 hover:bg-slate-500 !rounded-3xl max-h-10 w-[160px] text-[15px] font-nunito"
              type="button"
            >
              Trở thành ume
            </Button>
          </span>
          <span className="mr-5 rounded-full hover:scale-110 hover:ease-in-out">
            <button className="mt-2">
              <Search size={28} strokeWidth={4} fill="#FFFFFF" />
            </button>
          </span>
          <span className="mr-5 rounded-ful hover:scale-110 hover:ease-in-out">
            <button className="mt-2">
              <Gift size={28} strokeWidth={4} fill="#FFFFFF" />
            </button>
          </span>
          <span className="mr-5">
            {!userInfo ? (
              <>
                <Button
                  name="register"
                  customCSS="bg-[#37354F] py-2 hover:bg-slate-500  !rounded-3xl max-h-10 w-[120px] text-[15px] font-nunito"
                  type="button"
                  onClick={() => {
                    setIsModalVisible(true)
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
                        src={userInfo?.data?.avatarUrl.toString()}
                        alt="avatar"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item as="div">
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-violet-500 text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
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
                            Nhận nhiệm vụ hằng ngày
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
                            Lịch sử giao dịch
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item as="div">
                        {({ active }) => (
                          <button
                            onClick={handleSignout}
                            className={`${
                              active ? 'bg-violet-500 text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Đăng xuất
                          </button>
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
