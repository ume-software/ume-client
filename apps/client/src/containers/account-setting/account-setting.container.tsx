/* eslint-disable react-hooks/exhaustive-deps */
import { Coupon, EditName, Lock, MessagePrivacy, Remind, Setting, Transaction } from '@icon-park/react'
import logo from 'public/logo.png'
import { useAuth } from '~/contexts/auth'

import { ReactNode, useEffect, useState } from 'react'

import { Tooltip } from 'antd'
import { parse } from 'cookie'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'

import BecomeProvider from './components/become-provider/become-provider'
import EditNotificated from './components/edit-notificated'
import EditProfile from './components/edit-profile'
import Privacy from './components/privacy'
import ReportTicket from './components/report-ticket/report-ticket'
import TransactionHistory from './components/transaction-history/transaction-history'
import Voucher from './components/voucher/voucher'

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
    icon: <EditName theme="filled" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />,
    children: <EditProfile />,
  },
  {
    key: 'settingNotification',
    label: 'Thông báo',
    icon: <Remind theme="filled" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />,
    children: <EditNotificated />,
  },
  {
    key: 'settingPrivacy',
    label: 'Quyền riêng tư',
    icon: <Setting theme="filled" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />,
    children: <Privacy />,
  },
  {
    key: 'becomeProvider',
    label: 'Trở thành nhà cung cấp',
    icon: <Image width={20} height={20} src={logo} alt="BecomeProviderIcon" />,
    children: <BecomeProvider />,
  },
  {
    key: 'vouchers',
    label: 'Khuyến mãi',
    icon: <Coupon theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />,
    children: <Voucher />,
  },
  {
    key: 'transactionHistory',
    label: 'Lịch sử giao dịch',
    icon: <Transaction theme="outline" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />,
    children: <TransactionHistory />,
  },
  {
    key: 'reportTicket',
    label: 'Tố cáo',
    icon: <MessagePrivacy theme="filled" size="20" fill="#fff" strokeLinejoin="bevel" />,
    children: <ReportTicket />,
  },
]

const AccountSettingContainer = () => {
  const router = useRouter()
  const basePath = router.asPath.split('?')[0]
  const slug = router.query

  const accessToken = parse(document.cookie).accessToken
  const { user } = useAuth()

  const [children, setChildren] = useState<SettingTypeProps>(
    settingType.find((item) => item.key == slug.tab) ?? settingType[0],
  )

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

  useEffect(() => {
    if (accessToken) {
      return
    } else {
      router.replace({ pathname: '/home' })
    }
  }, [accessToken])

  useEffect(() => {
    setChildren(settingType.find((item) => item.key == slug.tab) ?? settingType[0])
  }, [slug.tab])

  return (
    <div className="grid min-h-screen grid-cols-10 text-white bg-umeBackground">
      <div className="col-span-2">
        <div className="min-w-[150px] min-h-[85%] max-h-[85%] p-10 bg-zinc-800 rounded-3xl sticky top-20 bottom-20 overflow-y-auto hide-scrollbar">
          <div className="flex flex-col gap-5">
            {settingType.map((item) => (
              <div
                key={item.key}
                className={`flex items-center gap-2 px-2 py-3 rounded-xl cursor-pointer hover:bg-gray-700 ${
                  children.key == item.key && 'bg-gray-700'
                }`}
                onClick={() => {
                  if (
                    !((item.key == 'becomeProvider' && !user?.slug) || (item.key == 'vouchers' && !user?.isProvider))
                  ) {
                    handleChangeTab(item.key)
                  }
                }}
              >
                {item.key == 'becomeProvider' ? (
                  <>
                    <div className={`${!user?.slug && 'opacity-30'}`}>{item.icon}</div>
                    {!user?.slug ? (
                      <Tooltip placement="right" title={'Thêm đường dẫn để mở khóa tính năng này'} arrow={true}>
                        <span
                          className={`w-full flex justify-between items-center text-xl font-semibold truncate ${
                            !user?.slug && 'opacity-30'
                          }`}
                        >
                          {item.label}

                          <Lock
                            className="pl-3 opacity-30"
                            theme="outline"
                            size="20"
                            fill="#FFF"
                            strokeLinejoin="bevel"
                          />
                        </span>
                      </Tooltip>
                    ) : (
                      <span className={`w-full flex justify-between items-center text-xl font-semibold truncate`}>
                        {item.label}
                      </span>
                    )}
                  </>
                ) : item.key == 'vouchers' ? (
                  <>
                    <div className={`${!user?.isProvider && 'opacity-30'}`}>{item.icon}</div>{' '}
                    {!user?.isProvider ? (
                      <Tooltip placement="right" title={'Trở thành nhà cung cấp để mở khóa tính năng này'} arrow={true}>
                        <span
                          className={`w-full flex justify-between items-center text-xl font-semibold truncate ${
                            !user?.isProvider && 'opacity-30'
                          }`}
                        >
                          {item.label}

                          <Lock
                            className="pl-3 opacity-30"
                            theme="outline"
                            size="20"
                            fill="#FFF"
                            strokeLinejoin="bevel"
                          />
                        </span>
                      </Tooltip>
                    ) : (
                      <span className={`w-full flex justify-between items-center text-xl font-semibold truncate`}>
                        {item.label}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <div>{item.icon}</div>
                    <p className="text-xl font-semibold truncate">{item.label}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="min-w-[770px] col-span-8">{children.children}</div>
    </div>
  )
}
export default AccountSettingContainer
