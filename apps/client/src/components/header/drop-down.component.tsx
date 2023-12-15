import { Menu, Transition } from '@headlessui/react'
import { Help, Logout, Setting, User, WalletOne } from '@icon-park/react'
import { useAuth } from '~/contexts/auth'

import { Fragment } from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'

export const DropDownMenu = () => {
  const { logout, user } = useAuth()

  return (
    <Menu>
      <div>
        <Menu.Button>
          <Image
            className="rounded-full"
            layout="fixed"
            height={35}
            width={35}
            src={user?.avatarUrl ?? ''}
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
        <Menu.Items className="absolute w-56 p-2 text-white origin-top-right divide-y divide-gray-200 rounded-md shadow-lg bg-umeHeader right-12 ring-1 ring-black ring-opacity-30 focus:outline-none">
          <Menu.Item as="div">
            {({ active }) => (
              <Link
                href={`/profile/${user?.slug || user?.id}?tab=${user?.isProvider ? 'Service' : 'Album'}`}
                className={`${
                  active ? 'bg-slate-700' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 text-white py-2 text-sm`}
              >
                <User theme="outline" size="20" fill="#ffffff" className="mr-3" />
                Tài khoản của bạn
              </Link>
            )}
          </Menu.Item>
          <Menu.Item as="div">
            {({ active }) => (
              <Link
                href={`/account-setting?user=${user?.name}&tab=transactionHistory`}
                className={`${
                  active ? 'bg-slate-700' : 'text-gray-900'
                } group flex w-full items-center rounded-md  text-white px-2 py-2 text-sm`}
              >
                <WalletOne theme="outline" size="20" fill="#ffffff" className="mr-3" />
                Biến động số dư
              </Link>
            )}
          </Menu.Item>
          <Menu.Item as="div">
            {({ active }) => (
              <Link
                href={`/account-setting?user=${user?.name}&tab=settingInformation`}
                className={`${
                  active ? 'bg-slate-700 text-white' : 'text-gray-900'
                } group flex w-full items-center rounded-md text-white px-2 py-2 text-sm`}
              >
                <Setting theme="outline" size="20" fill="#ffffff" className="mr-3" />
                Cài đặt tài khoản
              </Link>
            )}
          </Menu.Item>
          <Menu.Item as="div">
            {({ active }) => (
              <Link
                href={`/FAQ`}
                className={`${
                  active ? 'bg-slate-700 text-white' : 'text-gray-900'
                } group flex w-full items-center rounded-md text-white px-2 py-2 text-sm`}
              >
                <Help theme="outline" size="20" fill="#ffffff" className="mr-3" />
                Hỗ trợ
              </Link>
            )}
          </Menu.Item>

          <Menu.Item as="div">
            {({ active }) => (
              <button
                onClick={logout}
                className={`${
                  active ? 'bg-slate-700 ' : 'text-gray-900'
                } group flex w-full items-center rounded-md text-white px-2 py-2 text-sm`}
              >
                <Logout className="mr-3" theme="outline" size="20" fill="#ffffff" />
                Đăng xuất
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
