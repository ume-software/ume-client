import { Menu, Transition } from '@headlessui/react'
import { Logout, Setting, User, WalletOne } from '@icon-park/react'

import { Fragment } from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'

interface MenuProps {
  user: any
  handleLogout: () => void
}

export const DropDownMenu = ({ user, handleLogout }: MenuProps) => {
  return (
    <Menu>
      <div>
        <Menu.Button>
          <Image
            className="rounded-full"
            layout="fixed"
            height={35}
            width={35}
            src={user?.avatarUrl?.toString() ?? ''}
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
                href={`/account-setting?user=${user?.name}&tab=settingInformation`}
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
              <button
                onClick={handleLogout}
                className={`${
                  active ? 'bg-violet-500 text-white' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                <Logout className="mr-3" theme="outline" size="20" fill="#333" />
                Đăng xuất
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
