import { EditName, Remind, Setting } from '@icon-park/react'
import logo from 'public/logo.png'
import { useAuth } from '~/contexts/auth'

import { ReactNode, useContext, useEffect, useState } from 'react'
import React from 'react'

import Image from 'next/legacy/image'
import { useRouter } from 'next/router'

import BecomeProvider from './components/become-provider'
import EditNotificated from './components/edit-notificated'
import EditProfile from './components/edit-profile'
import Privacy from './components/privacy'

import { trpc } from '~/utils/trpc'

interface SettingTypeProps {
  key: string
  label: string
  icon: ReactNode
  children: ReactNode
}

const settingType: SettingTypeProps[] = [
  {
    key: 'settingInformation',
    label: 'Chỉnh sửa thông tin',
    icon: <EditName theme="filled" size="17" fill="#FFFFFF" strokeLinejoin="bevel" />,
    children: <EditProfile />,
  },
  {
    key: 'settingNotification',
    label: 'Thông báo',
    icon: <Remind theme="filled" size="17" fill="#FFFFFF" strokeLinejoin="bevel" />,
    children: <EditNotificated />,
  },
  {
    key: 'settingPrivacy',
    label: 'Quyền riêng tư',
    icon: <Setting theme="filled" size="17" fill="#FFFFFF" strokeLinejoin="bevel" />,
    children: <Privacy />,
  },
  {
    key: 'becomeProvider',
    label: 'Trở thành nhà cung cấp',
    icon: <Image width={20} height={20} src={logo} alt="BecomeProviderIcon" />,
    children: <BecomeProvider />,
  },
]

const AccountSettingContainer = () => {
  const router = useRouter()
  const basePath = router.asPath.split('?')[0]
  const slug = router.query

  const { isAuthenticated } = useAuth()

  const [children, setChildren] = useState<SettingTypeProps>(settingType[0])

  const handleChangeTab = (item: string) => {
    router.replace(
      {
        pathname: basePath,
        query: { ...slug, tab: item },
      },
      undefined,
      { shallow: true },
    )
  }

  //Uncomment nếu code xong
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     return
  //   } else {
  //     router.replace({ pathname: '/home' })
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isAuthenticated])

  useEffect(() => {
    handleChangeTab(children.key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children])

  return (
    <>
      <div className="min-h-screen bg-umeBackground grid grid-cols-10 text-white">
        <div className="col-span-2">
          <div className="min-w-[150px] p-10 bg-zinc-800 rounded-3xl sticky top-20">
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
                    <p className="text-xl font-semibold truncate">{item.label}</p>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
        <div className="min-w-[770px] col-span-8">{children.children}</div>
      </div>
    </>
  )
}
export default AccountSettingContainer
