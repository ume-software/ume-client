import { Menu, Transition } from '@headlessui/react'
import {
  Alarm,
  Check,
  CopyOne,
  Dot,
  Female,
  Lock,
  Male,
  More,
  PaperMoneyTwo,
  Plus,
  ShareTwo,
  Stopwatch,
} from '@icon-park/react'
import { Button } from '@ume/ui'
import detailBackground from 'public/detail-cover-background.png'
import ImgForEmpty from 'public/img-for-empty.png'
import lgbtIcon from 'public/rainbow-flag-11151.svg'

import { Fragment, ReactElement, useEffect, useState } from 'react'

import { ConfigProvider, Tooltip, message, theme } from 'antd'
import { isNil } from 'lodash'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import {
  BookingHistoryPagingResponse,
  ProviderConfigResponseStatusEnum,
  UserInformationResponse,
  UserInformationResponseGenderEnum,
} from 'ume-service-openapi'

import AlbumTab from './album-tab/album-tab'
import {
  BookingCountdown,
  getCurrentBookingForProviderData,
  getCurrentBookingForUserData,
} from './components/booking-countdown'
import DonateModal from './components/donate-modal'
import EndSoonModal from './components/end-soon-modal'
import FollowerModal from './components/follower-modal'
import FollowingModal from './components/following-modal'
import { ReportModal } from './components/report-modal'
import InformationTab from './information-tab/information-tab'
import PostTab from './post-tab'

import { LoginModal } from '~/components/header/login-modal.component'
import { SkeletonDetailProvider } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

interface TabDataProps {
  key: string
  label: string
  icon?: ReactElement
  [key: string]: any
}

const moreButtonDatas: TabDataProps[] = [
  {
    key: 'Report',
    label: 'Tố cáo',
    icon: (
      <Alarm
        className={`transition-opacity opacity-0 group-hover:opacity-100 group-hover:translate-x-3 duration-300`}
        theme="outline"
        size="20"
        fill="#fff"
      />
    ),
  },
  {
    key: 'Donate',
    label: 'Tặng quà',
    icon: (
      <PaperMoneyTwo
        className={`transition-opacity opacity-0 group-hover:opacity-100 group-hover:translate-x-3 duration-300`}
        theme="outline"
        size="20"
        fill="#fff"
      />
    ),
  },
  {
    key: 'Share',
    label: 'Copy đường dẫn',
    icon: (
      <CopyOne
        className={`transition-opacity opacity-0 group-hover:opacity-100 group-hover:translate-x-3 duration-300`}
        theme="outline"
        size="20"
        fill="#fff"
      />
    ),
  },
  {
    key: 'ShareToFacebook',
    label: 'Chia sẻ đến Facebook',
    icon: (
      <ShareTwo
        className={`transition-opacity opacity-0 group-hover:opacity-100 group-hover:translate-x-3 duration-300`}
        theme="outline"
        size="20"
        fill="#fff"
      />
    ),
  },
]

const tabDatas: TabDataProps[] = [
  {
    key: 'Service',
    label: `Dịch vụ`,
  },
  {
    key: 'Album',
    label: `Ảnh`,
  },
  {
    key: 'Post',
    label: `Bài viết`,
  },
]

const DetailProfileContainer = () => {
  const router = useRouter()
  const basePath = router.asPath.split('?')[0]
  const slug = router.query

  const accessToken = localStorage.getItem('accessToken')

  const [userInfo, setUserInfo] = useState<UserInformationResponse>()
  trpc.useQuery(['identity.identityInfo'], {
    onSuccess(data) {
      setUserInfo(data.data)
    },
    onError() {
      localStorage.removeItem('accessToken')
    },
    enabled: isNil(userInfo),
  })

  const [isModalLoginVisible, setIsModalLoginVisible] = useState(false)

  const [messageApi, contextHolder] = message.useMessage()
  const [providerDetail, setProviderDetail] = useState<UserInformationResponse | undefined>(undefined)

  const [isModalReportVisible, setIsModalReportVisible] = useState<boolean>(false)
  const [isModalDonationVisible, setIsModalDonationVisible] = useState<boolean>(false)
  const [isEndSoonModalVisible, setIsEndSoonModalVisible] = useState<boolean>(false)
  const [isFollowerModalVisible, setIsFollowerModalVisible] = useState<boolean>(false)
  const [isFollowingModalVisible, setIsFollowingModalVisible] = useState<boolean>(false)

  const { isLoading: isProviderDetailLoading } = trpc.useQuery(
    ['booking.getUserBySlug', String(slug?.profileId ?? '')],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: true,
      onSuccess(data) {
        if (data.data.id) {
          setProviderDetail(data.data)
        } else {
          router.replace('/404')
        }
      },
      onError() {
        router.replace('/404')
      },
      enabled: !!slug.profileId,
    },
  )

  const followProvider = trpc.useMutation(['identity.FollowProvider'])
  const unFollowProvider = trpc.useMutation(['identity.UnFollowProvider'])
  const utils = trpc.useContext()

  const currentBookingForProviderData: BookingHistoryPagingResponse['row'] | undefined =
    getCurrentBookingForProviderData()
  const currentBookingForUserData: BookingHistoryPagingResponse['row'] | undefined = getCurrentBookingForUserData()

  const [selectedTab, setSelectedTab] = useState<TabDataProps>(
    tabDatas.find((tab) => {
      return tab.key.toString() == slug.tab?.toString()
    }) ?? tabDatas[0],
  )

  useEffect(() => {
    if (!providerDetail?.isProvider) {
      setSelectedTab(
        slug.tab != tabDatas[0].key
          ? tabDatas.find((tab) => {
              return tab.key.toString() == slug.tab?.toString()
            }) ?? tabDatas[1]
          : tabDatas[1],
      )
    } else {
      setSelectedTab(
        tabDatas.find((tab) => {
          return tab.key.toString() == slug.tab?.toString()
        }) ?? tabDatas[0],
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerDetail])

  const handleChangeTab = (item: TabDataProps) => {
    router.replace(
      {
        pathname: basePath,
        query: { tab: item.key },
      },
      undefined,
      { shallow: true },
    )
    setSelectedTab(item)
  }

  const caculateAge = (dateOfBirth: string | undefined) => {
    if (dateOfBirth) {
      const currentDate = new Date().getFullYear()
      const dob = new Date(dateOfBirth).getFullYear()

      const age = Math.floor(currentDate - dob)

      return age
    } else {
      return 1
    }
  }

  const handleMenuButtonAction = (item: TabDataProps) => {
    if (item.key == 'Share') {
      navigator.clipboard.writeText(window.location.href)
      messageApi.open({
        type: 'success',
        content: 'Copy đường dẫn thành công',
        duration: 2,
      })
    } else if (item.key == 'ShareToFacebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
      messageApi.open({
        type: 'success',
        content: 'Mở facebook thành công',
        duration: 2,
      })
    } else if (item.key == 'Donate') {
      if (providerDetail && (userInfo || accessToken)) {
        setIsModalDonationVisible(true)
      } else {
        setIsModalLoginVisible(true)
      }
    } else if (item.key == 'Report') {
      if (providerDetail && (userInfo || accessToken)) {
        setIsModalReportVisible(true)
      } else {
        setIsModalLoginVisible(true)
      }
    }
  }

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        {contextHolder}
      </ConfigProvider>
      <LoginModal isModalLoginVisible={isModalLoginVisible} setIsModalLoginVisible={setIsModalLoginVisible} />
      <ReportModal
        isModalReportVisible={isModalReportVisible}
        setIsModalReportVisible={setIsModalReportVisible}
        providerId={providerDetail?.id ?? ''}
      />
      <DonateModal
        isModalDonationVisible={isModalDonationVisible}
        setIsModalDonationVisible={setIsModalDonationVisible}
        providerId={providerDetail?.id ?? ''}
      />
      <EndSoonModal
        isEndSoonModalVisible={isEndSoonModalVisible}
        setIsEndSoonModalVisible={setIsEndSoonModalVisible}
        bookingHistoryId={currentBookingForProviderData?.[0]?.id ?? currentBookingForUserData?.[0]?.id ?? ''}
      />
      <FollowerModal
        isFollowerModalVisible={isFollowerModalVisible}
        setIsFollowerModalVisible={setIsFollowerModalVisible}
      />
      <FollowingModal
        isFollowingModalVisible={isFollowingModalVisible}
        setIsFollowingModalVisible={setIsFollowingModalVisible}
      />

      {!providerDetail && isProviderDetailLoading ? (
        <SkeletonDetailProvider />
      ) : (
        <>
          <div style={{ height: '380px', margin: '0 70px' }}>
            <div className="absolute left-0 top-16" style={{ width: '100%', height: '416px' }}>
              <Image layout="fill" src={detailBackground} alt="background" />
            </div>
            <div className="flex flex-col justify-end h-full gap-5">
              <div className="flex flex-row items-baseline justify-between pb-5 md:items-center px-7">
                <div className="flex flex-col md:flex-row md:gap-x-8 gap-y-2" style={{ zIndex: 2 }}>
                  <div style={{ width: 194, height: 182, position: 'relative' }}>
                    <Image
                      className="absolute rounded-full"
                      layout="fill"
                      objectFit="cover"
                      src={providerDetail?.avatarUrl ?? ImgForEmpty}
                      alt="avatar"
                    />
                  </div>
                  <div className="flex flex-col my-2 text-white gap-y-2">
                    <p className="text-3xl font-medium text-white">{providerDetail?.name}</p>
                    <div className="flex flex-row items-center gap-3">
                      <div className="flex items-center gap-2 p-2 bg-gray-700 rounded-full">
                        <div>
                          {providerDetail?.gender == UserInformationResponseGenderEnum.Male && (
                            <Male theme="outline" size="20" fill="#3463f9" />
                          )}
                          {providerDetail?.gender == UserInformationResponseGenderEnum.Female && (
                            <Female theme="outline" size="20" fill="#f70a34" />
                          )}
                          {providerDetail?.gender == UserInformationResponseGenderEnum.Other && (
                            <div className="flex items-center">
                              <Image width={30} height={20} alt="lgbt-icon" src={lgbtIcon} layout="fixed" />
                            </div>
                          )}
                          {providerDetail?.gender == UserInformationResponseGenderEnum.Private && (
                            <Lock theme="outline" size="20" fill="#f7761c" />
                          )}
                        </div>
                        <p>{caculateAge(providerDetail?.dob)}</p>
                      </div>
                      <Tooltip placement="bottomLeft" title={`${providerDetail?.isOnline ? 'Online' : 'Offline'}`}>
                        <div className="flex items-center gap-1 p-2 bg-gray-700 rounded-full">
                          <Dot theme="multi-color" size="24" fill={providerDetail?.isOnline ? '#008000' : '#FF0000'} />
                          {providerDetail?.isOnline ? (
                            <>
                              <p>
                                {providerDetail?.providerConfig?.status == ProviderConfigResponseStatusEnum.Activated &&
                                  'Sẵn sàng'}
                              </p>
                              <p>
                                {providerDetail?.providerConfig?.status == ProviderConfigResponseStatusEnum.Busy &&
                                  'Bận'}
                              </p>
                              <p>
                                {providerDetail?.providerConfig?.status ==
                                  ProviderConfigResponseStatusEnum.StoppedAcceptingBooking && 'Ngừng nhận đơn'}
                              </p>
                              <p>
                                {providerDetail?.providerConfig?.status ==
                                  ProviderConfigResponseStatusEnum.UnActivated && 'Ngừng nhận đơn'}
                              </p>
                              <p>{!providerDetail?.isProvider && 'Hoạt động'}</p>
                            </>
                          ) : (
                            'Offline'
                          )}
                        </div>
                      </Tooltip>
                    </div>
                    <div className="items-center gap-3 space-y-2 lg:flex lg:space-y-0">
                      <div
                        className="flex items-center gap-2 p-2 bg-gray-700 rounded-full cursor-pointer w-fit hover:underline decoration-solid decoration-2"
                        onClick={() => setIsFollowerModalVisible(true)}
                        onKeyDown={() => {}}
                      >
                        Người theo dõi: {providerDetail?.followerAmount}
                      </div>
                      <div
                        className="flex items-center gap-2 p-2 bg-gray-700 rounded-full cursor-pointer w-fit hover:underline decoration-solid decoration-2"
                        onClick={() => setIsFollowingModalVisible(true)}
                        onKeyDown={() => {}}
                      >
                        <div>Đang theo dõi: {providerDetail?.followingAmount}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <>
                        {currentBookingForProviderData &&
                          (((currentBookingForProviderData[0]?.providerService?.provider as any)?.slug ??
                            (currentBookingForProviderData[0]?.providerService?.provider as any)?.id) ==
                            slug.profileId ||
                            (currentBookingForProviderData[0]?.booker?.slug ??
                              currentBookingForProviderData[0]?.booker?.id) == slug.profileId) &&
                          (currentBookingForProviderData?.length ?? 0) > 0 && (
                            <div className="text-center bg-gray-700 rounded-full">
                              <BookingCountdown />
                            </div>
                          )}
                      </>
                      <>
                        {currentBookingForUserData &&
                          (((currentBookingForUserData[0]?.providerService?.provider as any)?.slug ??
                            (currentBookingForUserData[0]?.providerService?.provider as any)?.id) == slug.profileId ||
                            (currentBookingForUserData[0]?.booker?.slug ?? currentBookingForUserData[0]?.booker?.id) ==
                              slug.profileId) &&
                          (currentBookingForUserData?.length ?? 0) > 0 && (
                            <div className="text-center bg-gray-700 rounded-full">
                              <BookingCountdown />
                            </div>
                          )}
                      </>

                      {currentBookingForUserData &&
                        (currentBookingForUserData?.length ?? 0) > 0 &&
                        (((currentBookingForUserData[0]?.providerService?.provider as any)?.slug ??
                          (currentBookingForUserData[0]?.providerService?.provider as any)?.id) == slug.profileId ||
                          (currentBookingForUserData[0]?.booker?.slug ?? currentBookingForUserData[0]?.booker?.id) ==
                            slug.profileId) && (
                          <>
                            <Tooltip placement="right" title={`Kết thúc sớm`}>
                              <div
                                className="p-2 bg-red-500 rounded-full cursor-pointer"
                                onClick={() => {
                                  setIsEndSoonModalVisible(true)
                                }}
                                onKeyDown={() => {}}
                              >
                                <Stopwatch theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />
                              </div>
                            </Tooltip>
                          </>
                        )}
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center justify-start gap-10" style={{ zIndex: 5 }}>
                  <div
                    className={`${
                      providerDetail?.isFollowing ? 'bg-transparent text-purple-600' : 'bg-purple-600'
                    } rounded-xl 2xl:mr-10 xl:mr-5 lg:mr-2 mr-0`}
                  >
                    {userInfo?.id != providerDetail?.id && (
                      <>
                        {providerDetail?.isFollowing ? (
                          <Button
                            isActive={true}
                            isOutlinedButton={true}
                            customCSS="p-2 rounded-xl hover:scale-105"
                            type="button"
                            onClick={() => {
                              if (
                                providerDetail &&
                                (userInfo || accessToken) &&
                                !unFollowProvider.isLoading &&
                                !followProvider.isLoading
                              ) {
                                unFollowProvider.mutate(providerDetail.slug ?? providerDetail.id, {
                                  onSuccess() {
                                    utils.invalidateQueries('booking.getFollowingByUserSlug')
                                    utils.invalidateQueries('booking.getFollowerByUserSlug')
                                    utils.invalidateQueries('booking.getUserBySlug')
                                  },
                                })
                              } else {
                                setIsModalLoginVisible(true)
                              }
                            }}
                          >
                            {unFollowProvider.isLoading ? (
                              <span
                                className={`spinner h-5 w-5 animate-spin rounded-full border-[3px] border-r-transparent border-white`}
                              />
                            ) : (
                              <Check className="px-3" theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />
                            )}
                            Đang theo dõi
                          </Button>
                        ) : (
                          <Button
                            isActive={true}
                            isOutlinedButton={true}
                            customCSS="p-2 rounded-xl hover:scale-105 outline-purple-600"
                            type="button"
                            onClick={() => {
                              if (
                                providerDetail &&
                                (userInfo || accessToken) &&
                                !unFollowProvider.isLoading &&
                                !followProvider.isLoading
                              ) {
                                followProvider.mutate(providerDetail.slug ?? providerDetail.id, {
                                  onSuccess() {
                                    utils.invalidateQueries('booking.getFollowingByUserSlug')
                                    utils.invalidateQueries('booking.getFollowerByUserSlug')
                                    utils.invalidateQueries('booking.getUserBySlug')
                                  },
                                })
                              } else {
                                setIsModalLoginVisible(true)
                              }
                            }}
                          >
                            {followProvider.isLoading ? (
                              <span
                                className={`spinner h-5 w-5 animate-spin rounded-full border-[3px] border-r-transparent border-white`}
                              />
                            ) : (
                              <Plus className="px-3" theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />
                            )}
                            Theo dõi
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                  <Menu>
                    <div>
                      <Menu.Button>
                        <More
                          className="flex flex-row items-center bg-gray-700 rounded-full cursor-pointer"
                          theme="filled"
                          size="25"
                          fill="#FFFFFF"
                          strokeLinejoin="bevel"
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
                      <Menu.Items className="absolute right-0 p-2 origin-top-right divide-y divide-gray-200 rounded-md shadow-lg bg-umeHeader divide-opacity-30 w-fit top-7 ring-1 ring-black ring-opacity-30 focus:outline-none">
                        <div className="flex flex-col gap-2 w-max">
                          {moreButtonDatas.map((item) => (
                            <Fragment key={item.key}>
                              {userInfo?.id == providerDetail?.id || !providerDetail?.isProvider ? (
                                item.key != 'Donate' && (
                                  <div
                                    className={`p-2 cursor-pointer rounded-t-md hover:bg-gray-700 text-white group border-b-2 border-white border-opacity-30 last:border-none last:rounded-md`}
                                    onClick={() => {
                                      handleMenuButtonAction(item)
                                    }}
                                    onKeyDown={() => {}}
                                  >
                                    <div className="flex items-center justify-between gap-2 duration-300 scale-x-100 rounded-md group-hover:scale-x-95 group-hover:-translate-x-2">
                                      <div>{item.label}</div>
                                      {item.icon}
                                    </div>
                                  </div>
                                )
                              ) : (
                                <div
                                  className={`p-2 cursor-pointer rounded-t-md hover:bg-gray-700 ${
                                    item.key == 'UnFollow' ? 'text-purple-600 font-semibold' : 'text-white font-normal'
                                  } group border-b-2 border-white last:border-none last:rounded-md`}
                                  onClick={() => {
                                    handleMenuButtonAction(item)
                                  }}
                                  onKeyDown={() => {}}
                                >
                                  <div className="flex items-center justify-between gap-2 duration-300 scale-x-100 rounded-md group-hover:scale-x-95 group-hover:-translate-x-2">
                                    <div>{item.label}</div>
                                    {item.icon}
                                  </div>
                                </div>
                              )}
                            </Fragment>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>

              <div className="flex flex-row gap-10" style={{ zIndex: 2 }}>
                {tabDatas.map((item) => (
                  <Fragment key={item.key}>
                    {providerDetail?.isProvider ? (
                      <span
                        className={`text-white xl:text-2xl text-xl font-medium p-4 cursor-pointer ${
                          item.key == selectedTab.key ? 'border-b-4 border-purple-700' : ''
                        }`}
                        onClick={() => handleChangeTab(item)}
                        data-tab={item.label}
                        onKeyDown={() => {}}
                      >
                        {item.label}
                      </span>
                    ) : (
                      item.key != 'Service' && (
                        <span
                          className={`text-white xl:text-2xl text-xl font-medium p-4 cursor-pointer ${
                            item.key == selectedTab.key ? 'border-b-4 border-purple-700' : ''
                          }`}
                          onClick={() => handleChangeTab(item)}
                          data-tab={item.label}
                          onKeyDown={() => {}}
                        >
                          {item.label}
                        </span>
                      )
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
          <div className="p-5">
            <span className="text-white">
              <div className="flex justify-center min-h-screen my-10">
                {providerDetail?.isProvider && selectedTab.key == 'Service' && <InformationTab data={providerDetail} />}
                {selectedTab.key == 'Album' && <AlbumTab />}
                {selectedTab.key == 'Post' && <PostTab providerId={providerDetail?.slug ?? providerDetail?.id ?? ''} />}
              </div>
            </span>
          </div>
        </>
      )}
    </>
  )
}
export default DetailProfileContainer
