import { EditName, Remind, Setting } from '@icon-park/react'

import { ReactNode, useContext, useEffect, useState } from 'react'
import React from 'react'

import EditNotificated from './components/edit-notificated'
import EditProfile from './components/edit-profile'
import Privacy from './components/privacy'

import { UserContext } from '~/components/layouts/app-layout/app-layout'

import { trpc } from '~/utils/trpc'

interface SettingTypeProps {
  key: number
  label: string
  icon: ReactNode
  children: ReactNode
}

const settingType: SettingTypeProps[] = [
  {
    key: 1,
    label: 'Chỉnh sửa thông tin',
    icon: <EditName theme="filled" size="17" fill="#FFFFFF" strokeLinejoin="bevel" />,
    children: <EditProfile />,
  },
  {
    key: 2,
    label: 'Thông báo',
    icon: <Remind theme="filled" size="17" fill="#FFFFFF" strokeLinejoin="bevel" />,
    children: <EditNotificated />,
  },
  {
    key: 3,
    label: 'Quyền riêng tư',
    icon: <Setting theme="filled" size="17" fill="#FFFFFF" strokeLinejoin="bevel" />,
    children: <Privacy />,
  },
]

const AccountSettingContainer = () => {
  const [children, setChildren] = useState<SettingTypeProps>(settingType[0])

  return (
    <>
      <div className="h-screen grid grid-cols-10 text-white">
        <div className="col-span-2">
          <div className="p-10 bg-zinc-800 rounded-2xl sticky top-20">
            <div className="flex flex-col gap-5">
              {settingType.map((item) => (
                <>
                  <div
                    key={item.key}
                    className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer hover:bg-gray-700 ${
                      children.key == item.key && 'bg-gray-700'
                    }`}
                    onClick={() => setChildren(item)}
                  >
                    <div>{item.icon}</div>
                    <p className="text-xl font-semibold">{item.label}</p>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-8">{children.children}</div>
      </div>
    </>
  )
}
export default AccountSettingContainer
