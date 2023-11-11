/* eslint-disable react-hooks/exhaustive-deps */
import { Coupon, EditName, Lock, MessagePrivacy, Remind, Setting, Transaction } from '@icon-park/react'
import logo from 'public/logo.png'
import 'swiper/swiper-bundle.css'
import { useAuth } from '~/contexts/auth'

import { ReactNode, useEffect, useState } from 'react'

import { Tooltip } from 'antd'
import { parse } from 'cookie'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import { Swiper, SwiperSlide } from 'swiper/react'

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
    label: 'Nhà cung cấp',
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
    <>
      <div className="min-h-screen bg-umeBackground grid grid-cols-10 mr-10 text-white">
        <div className="col-span-10 xl:col-span-2 w-full sticky xl:top-20 top-16 z-[5]">
          <div className="min-w-[150px] xl:min-h-[85%] xl:max-h-[85%] xl:p-10 py-5 xl:bg-zinc-800 bg-umeBackground xl:rounded-3xl sticky top-20 bottom-20 overflow-y-auto hide-scrollbar">
            <div className="hidden xl:flex flex-col gap-5">
              {settingType.map((item) => (
                <>
                  <div
                    key={item.key}
                    className={`flex items-center gap-2 px-2 py-3 rounded-xl cursor-pointer hover:bg-gray-700 ${
                      children.key == item.key && 'bg-gray-700'
                    }`}
                    onClick={() => {
                      if (
                        !(
                          (item.key == 'becomeProvider' && !user?.slug) ||
                          (item.key == 'vouchers' && !user?.isProvider)
                        )
                      ) {
                        handleChangeTab(item.key)
                      }
                    }}
                    onKeyDown={() => {}}
                  >
                    {item.key == 'becomeProvider' ? (
                      <>
                        <div className={`${!user?.isVerified && 'opacity-30'}`}>{item.icon}</div>
                        {!user?.isVerified ? (
                          <Tooltip placement="right" title={'Xác minh danh tính để mở kháo tính năng này'} arrow={true}>
                            <span
                              className={`w-full flex justify-between items-center 2xl:text-lg xl:text-sm text-xs font-semibold truncate ${
                                !user?.isVerified && 'opacity-30'
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
                          <span
                            className={`w-full flex justify-between items-center 2xl:text-lg xl:text-sm text-xs font-semibold truncate`}
                          >
                            {item.label}
                          </span>
                        )}
                      </>
                    ) : item.key == 'vouchers' ? (
                      <>
                        <div className={`${!user?.isProvider && 'opacity-30'}`}>{item.icon}</div>{' '}
                        {!user?.isProvider ? (
                          <Tooltip
                            placement="right"
                            title={'Trở thành nhà cung cấp để mở khóa tính năng này'}
                            arrow={true}
                          >
                            <span
                              className={`w-full flex justify-between items-center 2xl:text-lg xl:text-sm text-xs font-semibold truncate ${
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
                          <span
                            className={`w-full flex justify-between items-center 2xl:text-lg xl:text-sm lg:text-md md:text-xs font-semibold truncate`}
                          >
                            {item.label}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <div>{item.icon}</div>
                        <p className="2xl:text-lg xl:text-sm lg:text-md md:text-xs font-semibold truncate">
                          {item.label}
                        </p>
                      </>
                    )}
                  </div>
                </>
              ))}
            </div>
            <div className="w-full xl:hidden">
              <Swiper
                spaceBetween={20}
                slidesPerView="auto"
                mousewheel={true}
                direction="horizontal"
                className="w-full"
              >
                {settingType.map((item) => (
                  <SwiperSlide
                    key={item.key}
                    className={`max-w-fit xl:hidden px-2 py-3 border-2 border-white border-opacity-30 rounded-xl cursor-pointer hover:bg-gray-700 ${
                      children.key == item.key && 'bg-gray-700'
                    }`}
                    onClick={() => {
                      if (
                        !(
                          (item.key == 'becomeProvider' && !user?.slug) ||
                          (item.key == 'vouchers' && !user?.isProvider)
                        )
                      ) {
                        handleChangeTab(item.key)
                      }
                    }}
                    onKeyDown={() => {}}
                  >
                    <div className="w-fit flex items-center gap-2">
                      {item.key == 'becomeProvider' ? (
                        <>
                          <div className={`${!user?.isVerified && 'opacity-30'}`}>{item.icon}</div>
                          {!user?.isVerified ? (
                            <Tooltip
                              placement="right"
                              title={'Xác minh danh tính để mở kháo tính năng này'}
                              arrow={true}
                            >
                              <span
                                className={`w-full flex justify-between items-center text-lg font-semibold truncate ${
                                  !user?.isVerified && 'opacity-30'
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
                            <span className={`w-full flex justify-between items-center text-lg font-semibold truncate`}>
                              {item.label}
                            </span>
                          )}
                        </>
                      ) : item.key == 'vouchers' ? (
                        <>
                          <div className={`${!user?.isProvider && 'opacity-30'}`}>{item.icon}</div>{' '}
                          {!user?.isProvider ? (
                            <Tooltip
                              placement="right"
                              title={'Trở thành nhà cung cấp để mở khóa tính năng này'}
                              arrow={true}
                            >
                              <span
                                className={`w-full flex justify-between items-center text-lg lg:text-md font-semibold truncate ${
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
                            <span
                              className={`w-full flex justify-between items-center xl:text-lg lg:text-md font-semibold truncate`}
                            >
                              {item.label}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <div>{item.icon}</div>
                          <p className="xl:text-lg lg:text-md font-semibold truncate">{item.label}</p>
                        </>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
        <div className="min-w-[770px] xl:col-span-8 col-span-10 xl:mt-0 mt-8 z-0">{children.children}</div>
      </div>
    </>
  )
}
export default AccountSettingContainer
