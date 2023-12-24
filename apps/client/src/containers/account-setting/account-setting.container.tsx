/* eslint-disable react-hooks/exhaustive-deps */
import { Coupon, EditName, Expenses, FileStaffOne, Lock, Remind, Transaction, TransactionOrder } from '@icon-park/react'
import logo from 'public/logo.png'
import 'swiper/swiper-bundle.css'
import { useAuth } from '~/contexts/auth'

import { ReactNode, useEffect, useState } from 'react'

import { Tooltip } from 'antd'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import { Swiper, SwiperSlide } from 'swiper/react'
import { UserInformationResponse } from 'ume-service-openapi'

import BecomeProvider from './components/become-provider/become-provider'
import BookingHistory from './components/booking-history/booking-history'
import Complain from './components/complain/complain'
import EditNotificated from './components/edit-notificated'
import EditProfile from './components/edit-profile/edit-profile'
import TransactionHistory from './components/transaction-history/transaction-history'
import Voucher from './components/voucher/voucher'
import Withdraw from './components/withdraw/withdraw'

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
    key: 'withdraw',
    label: 'Rút tiền',
    icon: <Expenses theme="filled" size="20" fill="#fff" strokeLinejoin="bevel" />,
    children: <Withdraw />,
  },
  {
    key: 'transactionHistory',
    label: 'Biến động số dư',
    icon: <Transaction theme="outline" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />,
    children: <TransactionHistory />,
  },
  {
    key: 'bookingHistory',
    label: 'Lịch sử thuê',
    icon: <TransactionOrder theme="outline" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />,
    children: <BookingHistory />,
  },
  {
    key: 'complain',
    label: 'Khiếu nại',
    icon: <FileStaffOne theme="outline" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />,
    children: <Complain />,
  },
]

const AccountSettingContainer = () => {
  const router = useRouter()
  const basePath = router.asPath.split('?')[0]
  const slug = router.query

  const { isAuthenticated } = useAuth()
  const [userInfo, setUserInfo] = useState<UserInformationResponse | null>(null)
  const [children, setChildren] = useState<SettingTypeProps>(
    settingType.find((item) => item.key == slug.tab) ?? settingType[0],
  )

  const { isFetching, isLoading } = trpc.useQuery(['identity.identityInfo'], {
    onSuccess(data) {
      setUserInfo(data.data)
    },
    onError() {},
    enabled: isAuthenticated,
  })

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
    if (!isFetching && !isLoading && !userInfo) {
      router.push('/')
    }
  }, [])

  useEffect(() => {
    setChildren(settingType.find((item) => item.key == slug.tab) ?? settingType[0])
  }, [slug.tab])

  return (
    <div className="grid min-h-screen grid-cols-10 mr-10 text-white bg-umeBackground">
      <div className="col-span-10 xl:col-span-2 w-full sticky xl:top-20 top-16 z-[5]">
        <div className="min-w-[150px] xl:min-h-[85%] xl:max-h-[85%] xl:p-10 py-5 xl:bg-zinc-800 bg-umeBackground xl:rounded-3xl sticky top-20 bottom-20 overflow-y-auto hide-scrollbar">
          <div className="flex-col hidden gap-5 xl:flex">
            {settingType.map((item) => (
              <>
                <div
                  key={item.key}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl cursor-pointer hover:bg-gray-700 ${
                    children.key == item.key && 'bg-gray-700'
                  }`}
                  onClick={() => {
                    if (
                      !(
                        (item.key == 'becomeProvider' && !userInfo?.isVerified) ||
                        (item.key == 'vouchers' && !userInfo?.isProvider) ||
                        (item.key == 'withdraw' && !userInfo?.isProvider)
                      )
                    ) {
                      handleChangeTab(item.key)
                    }
                  }}
                  onKeyDown={() => {}}
                >
                  {item.key == 'becomeProvider' ? (
                    <>
                      <div className={`${!userInfo?.isVerified && 'opacity-30'}`}>{item.icon}</div>
                      {!userInfo?.isVerified ? (
                        <Tooltip placement="right" title={'Xác minh danh tính để mở khoá tính năng này'} arrow={true}>
                          <span
                            className={`w-full flex justify-between items-center 2xl:text-lg xl:text-sm text-xs font-semibold truncate ${
                              !userInfo?.isVerified && 'opacity-30'
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
                      <div className={`${!userInfo?.isProvider && 'opacity-30'}`}>{item.icon}</div>{' '}
                      {!userInfo?.isProvider ? (
                        <Tooltip
                          placement="right"
                          title={'Trở thành nhà cung cấp để mở khóa tính năng này'}
                          arrow={true}
                        >
                          <span
                            className={`w-full flex justify-between items-center 2xl:text-lg xl:text-sm text-xs font-semibold truncate ${
                              !userInfo?.isProvider && 'opacity-30'
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
                  ) : item.key == 'withdraw' ? (
                    <>
                      <div className={`${!userInfo?.isProvider && 'opacity-30'}`}>{item.icon}</div>{' '}
                      {!userInfo?.isProvider ? (
                        <Tooltip
                          placement="right"
                          title={'Trở thành nhà cung cấp để mở khóa tính năng này'}
                          arrow={true}
                        >
                          <span
                            className={`w-full flex justify-between items-center 2xl:text-lg xl:text-sm text-xs font-semibold truncate ${
                              !userInfo?.isProvider && 'opacity-30'
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
                      <p className="font-semibold truncate 2xl:text-lg xl:text-sm lg:text-md md:text-xs">
                        {item.label}
                      </p>
                    </>
                  )}
                </div>
              </>
            ))}
          </div>
          <div className="w-full xl:hidden">
            <Swiper spaceBetween={20} slidesPerView="auto" mousewheel={true} direction="horizontal" className="w-full">
              {settingType.map((item) => (
                <SwiperSlide
                  key={item.key}
                  className={`max-w-fit xl:hidden px-2 py-3 border-2 border-white border-opacity-30 rounded-xl cursor-pointer hover:bg-gray-700 ${
                    children.key == item.key && 'bg-gray-700'
                  }`}
                  onClick={() => {
                    if (
                      !(
                        (item.key == 'becomeProvider' && !userInfo?.isVerified) ||
                        (item.key == 'vouchers' && !userInfo?.isProvider) ||
                        (item.key == 'withdraw' && !userInfo?.isProvider)
                      )
                    ) {
                      handleChangeTab(item.key)
                    }
                  }}
                  onKeyDown={() => {}}
                >
                  <div className="flex items-center gap-2 w-fit">
                    {item.key == 'becomeProvider' ? (
                      <>
                        <div className={`${!userInfo?.isVerified && 'opacity-30'}`}>{item.icon}</div>
                        {!userInfo?.isVerified ? (
                          <Tooltip placement="right" title={'Xác minh danh tính để mở kháo tính năng này'} arrow={true}>
                            <span
                              className={`w-full flex justify-between items-center text-lg font-semibold truncate ${
                                !userInfo?.isVerified && 'opacity-30'
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
                        <div className={`${!userInfo?.isProvider && 'opacity-30'}`}>{item.icon}</div>{' '}
                        {!userInfo?.isProvider ? (
                          <Tooltip
                            placement="right"
                            title={'Trở thành nhà cung cấp để mở khóa tính năng này'}
                            arrow={true}
                          >
                            <span
                              className={`w-full flex justify-between items-center text-lg lg:text-md font-semibold truncate ${
                                !userInfo?.isProvider && 'opacity-30'
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
                    ) : item.key == 'withdraw' ? (
                      <>
                        <div className={`${!userInfo?.isProvider && 'opacity-30'}`}>{item.icon}</div>{' '}
                        {!userInfo?.isProvider ? (
                          <Tooltip
                            placement="right"
                            title={'Trở thành nhà cung cấp để mở khóa tính năng này'}
                            arrow={true}
                          >
                            <span
                              className={`w-full flex justify-between items-center text-lg lg:text-md font-semibold truncate ${
                                !userInfo?.isProvider && 'opacity-30'
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
                        <p className="font-semibold truncate xl:text-lg lg:text-md">{item.label}</p>
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
  )
}
export default AccountSettingContainer
