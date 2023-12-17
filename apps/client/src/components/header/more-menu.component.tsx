import { Menu, Transition } from '@headlessui/react'
import { More } from '@icon-park/react'

import { FC, Fragment } from 'react'

import Link from 'next/link'

import { moreMenuItem } from './more-menu-item'

export const MoreMenu: FC = () => {
  return (
    <Menu>
      <div className="mt-2">
        <Menu.Button>
          <More size={32} />
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
        <Menu.Items className="absolute w-56 p-2 text-white origin-top-left divide-y divide-gray-200 rounded-md shadow-lg bg-umeHeader left-12 ring-1 ring-black ring-opacity-30 focus:outline-none">
          {moreMenuItem.map((item) => (
            <Menu.Item key={item.id} as="div">
              {({ active }) => (
                <Link
                  href={`/${item.path}`}
                  className={`${
                    active ? 'bg-slate-700' : 'text-gray-900'
                  } group flex w-full items-center rounded-md  text-white px-2 py-2 text-sm`}
                >
                  {item.name}
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
