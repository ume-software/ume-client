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
    label: 'Chỉnh sửa thông tin cá nhân',
    icon: <EditName theme="filled" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />,
    children: <EditProfile />,
  },
  {
    key: 2,
    label: 'Thông báo',
    icon: <Remind theme="filled" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />,
    children: <EditNotificated />,
  },
  {
    key: 3,
    label: 'Quyền riêng tư',
    icon: <Setting theme="filled" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />,
    children: <Privacy />,
  },
]

const AccountSettingContainer = () => {
  const { userContext } = useContext(UserContext)
  const {
    data: userSettingData,
    isLoading: isLoadingUserSettingData,
    isFetching: isFetchingUserSettingData,
  } = trpc.useQuery(['identity.getUserBySlug', String(userContext?.id || '')])

  return (
    <>
      <div className="grid grid-cols-10 text-white">
        <div className="col-span-3">
          {settingType.map((item) => (
            <>
              <div key={item.key} className="flex items-center gap-2">
                <div>{item.icon}</div>
                <p>{item.label}</p>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  )
}
export default AccountSettingContainer
