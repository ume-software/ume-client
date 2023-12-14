import { Down, Gamepad, People, Right } from '@icon-park/react'
import { CustomDrawer } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'
import 'swiper/swiper-bundle.css'
import Chat from '~/containers/chat/chat.container'

import { useContext, useEffect, useState } from 'react'

import { notification } from 'antd'
import { parse } from 'cookie'
import { isNil } from 'lodash'
import Image from 'next/legacy/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Swiper, SwiperSlide } from 'swiper/react'
import { BookingHistoryPagingResponse, UserInformationResponse } from 'ume-service-openapi'

import BookingProvider from '../booking/booking-provider.container'
import { BookingCountdown, getCurrentBookingForUserData } from '../components/booking-countdown'
import PersonalIntroduce from './personal-introduce'
import Service from './service'

import { LoginModal } from '~/components/header/login-modal.component'
import { DrawerContext } from '~/components/layouts/app-layout/app-layout'
import { BGFullGridSkeleton, ChatSkeleton } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const InformationTab = (props: { data: UserInformationResponse }) => {
  const router = useRouter()
  const basePath = router.asPath.split('?')[0]
  const slug = router.query

  const [userInfo, setUserInfo] = useState<UserInformationResponse>()
  trpc.useQuery(['identity.identityInfo'], {
    onSuccess(data) {
      setUserInfo(data.data)
    },
    onError() {
      sessionStorage.removeItem('accessToken')
      sessionStorage.removeItem('refeshToken')
    },
    enabled: isNil(userInfo),
  })
  const accessToken = sessionStorage.getItem('accessToken')

  const [isModalLoginVisible, setIsModalLoginVisible] = useState(false)
  const { childrenDrawer, setChildrenDrawer } = useContext(DrawerContext)
  const [channelId, setChannelId] = useState<string>('')
  const [gamesToggle, setGamesToggle] = useState(true)
  const [gameSelected, setGameSelected] = useState<string | undefined>(slug.service?.toString() ?? undefined)

  const createNewChatChannel = trpc.useMutation(['chatting.createNewChatChannel'])
  const currentBookingForUserData: BookingHistoryPagingResponse['row'] | undefined = getCurrentBookingForUserData()

  const selectedService =
    props.data?.providerServices!.find(
      (providerSkill) => gameSelected == providerSkill?.service?.slug || gameSelected == providerSkill.serviceId,
    ) ?? undefined

  const handleGamesToggle = () => {
    setGamesToggle(!gamesToggle)
  }

  const handleSelected = (service: string | undefined) => {
    router.replace(
      {
        pathname: basePath,
        query: { tab: slug.tab, service: service },
      },
      undefined,
      {
        shallow: true,
      },
    )

    setGameSelected(service)
  }

  useEffect(() => {
    setChannelId(String(props.data?.id))
  }, [props.data, setChannelId])

  const handleChatOpen = async () => {
    if (userInfo) {
      setChildrenDrawer(<ChatSkeleton />)
      try {
        createNewChatChannel.mutate(
          {
            receiverId: channelId,
          },
          {
            onSuccess: (data) => {
              setChildrenDrawer(<Chat providerId={data.data._id} />)
            },
            onError: (error) => {
              notification.error({
                message: 'Create New Channel Fail',
                description: 'Create New Channel Fail. Please try again!',
                placement: 'bottomLeft',
              })
            },
          },
        )
      } catch (error) {
        notification.error({
          message: 'Create New Channel Fail',
          description: 'Create New Channel Fail. Please try again!',
          placement: 'bottomLeft',
        })
      }
    } else {
      setIsModalLoginVisible(true)
    }
  }
  const handleOrderOpen = () => {
    if (userInfo) {
      setChildrenDrawer(<BookingProvider data={props.data} />)
    } else {
      setIsModalLoginVisible(true)
    }
  }
  const isSpecialTime = (startTimeOfDay: string | undefined, endTimeOfDay: string | undefined) => {
    if (startTimeOfDay && endTimeOfDay) {
      const currentTime = new Date()
      const currentHours = currentTime.getHours()
      const currentMinutes = currentTime.getMinutes()

      const [startHours, startMinutes] = startTimeOfDay.split(':').map(Number)
      const [endHours, endMinutes] = endTimeOfDay.split(':').map(Number)

      return (
        (startHours > endHours &&
          (currentHours > startHours ||
            (currentHours === startHours && currentMinutes >= startMinutes) ||
            currentHours < endHours ||
            (currentHours === endHours && currentMinutes <= endMinutes))) ||
        (startHours < endHours &&
          (currentHours > startHours || (currentHours === startHours && currentMinutes >= startMinutes)) &&
          (currentHours < endHours || (currentHours === endHours && currentMinutes <= endMinutes)))
      )
    }
    return false
  }

  return (
    <>
      <div>
        <LoginModal isModalLoginVisible={isModalLoginVisible} setIsModalLoginVisible={setIsModalLoginVisible} />
      </div>
      {props.data ? (
        <div className="grid w-full grid-cols-10 gap-10 px-10">
          <div className="col-span-10 2xl:col-span-2">
            <div className="sticky py-10 px-7 bg-zinc-800 rounded-3xl top-20">
              <div className="flex flex-col gap-5">
                <div
                  className={`hidden 2xl:flex items-center p-3 rounded-xl gap-2 cursor-pointer hover:bg-gray-700 ${
                    !gameSelected ? 'bg-gray-700' : ''
                  }`}
                  onClick={() => handleSelected(undefined)}
                  onKeyDown={() => {}}
                >
                  <People theme="outline" size="18" fill="#fff" />
                  <p className="text-xs font-normal truncate xl:text-lg lg:text-sm lg:font-semibold">Đôi chút về tui</p>
                </div>
                <div className="flex-col hidden gap-5 cursor-pointer 2xl:flex">
                  <div onClick={handleGamesToggle} onKeyDown={() => {}}>
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row items-center gap-2 p-3">
                        <Gamepad theme="outline" size="18" fill="#fff" />
                        <p className="text-xs font-normal truncate xl:text-lg lg:text-sm lg:font-semibold">
                          Game tui chơi
                        </p>
                      </div>

                      {gamesToggle ? (
                        <Down theme="outline" size="20" fill="#fff" />
                      ) : (
                        <Right theme="outline" size="20" fill="#fff" />
                      )}
                    </div>
                  </div>
                  <div
                    className={`pl-5 gap-3 ${
                      gamesToggle
                        ? 'flex flex-col items-start max-h-[500px] overflow-y-scroll overflow-x-hidden hide-scrollbar'
                        : 'hidden'
                    }`}
                  >
                    {props.data?.providerServices?.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center w-full group gap-3 hover:bg-gray-700 p-1 rounded-xl ${
                          gameSelected && (gameSelected == item.service?.slug || gameSelected == item.serviceId)
                            ? 'bg-gray-700'
                            : ''
                        }`}
                        onClick={() => handleSelected(item.service?.slug ?? item.serviceId)}
                        onKeyDown={() => {}}
                      >
                        <Image
                          className="min-w-[60px] min-h-[80px]"
                          src={item?.service?.imageUrl ?? ImgForEmpty}
                          alt="Game Image"
                          width={60}
                          height={80}
                        />
                        <div className="w-full">
                          <p className="lg:font-semibold font-normal xl:text-md lg:text-sm text-xs text-white z-[4] group-hover:w-fit">
                            {item?.service?.name}
                          </p>
                          <span className="flex items-center gap-1 lg:font-semibold font-normal xl:text-sm lg:text-xs text-white opacity-30 z-[4] truncate group-hover:w-fit">
                            {(
                              item.bookingCosts?.find((spectialTime) => {
                                if (isSpecialTime(spectialTime?.startTimeOfDay, spectialTime?.endTimeOfDay)) {
                                  return spectialTime
                                }
                              })?.amount ?? item.defaultCost
                            )?.toLocaleString('en-US', {
                              currency: 'VND',
                            })}
                            <p className="text-xs italic"> đ</p> / 1h
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 2xl:hidden">
                  <div
                    className={`flex flex-col justify-center items-center p-3 rounded-xl gap-2 cursor-pointer hover:bg-gray-700 ${
                      !gameSelected ? 'bg-gray-700' : ''
                    }`}
                    onClick={() => handleSelected(undefined)}
                    onKeyDown={() => {}}
                  >
                    <People theme="outline" size="25" fill="#fff" />
                    <p className="text-xs font-normal truncate xl:text-lg lg:text-sm lg:font-semibold">Về tui</p>
                  </div>
                  <Swiper
                    spaceBetween={20}
                    slidesPerView="auto"
                    mousewheel={true}
                    direction="horizontal"
                    className="w-full"
                  >
                    {props.data?.providerServices?.map((item) => (
                      <SwiperSlide
                        key={item.id}
                        className={`min-w-[250px] max-w-fit gap-3 border-2 border-white border-opacity-30 px-3 py-1 hover:bg-gray-700 rounded-xl ${
                          gameSelected && (gameSelected == item.service?.slug || gameSelected == item.serviceId)
                            ? 'bg-gray-700'
                            : ''
                        }`}
                        onClick={() => handleSelected(item.service?.slug ?? item.serviceId)}
                      >
                        <div className="flex items-center gap-3">
                          <Image src={item?.service?.imageUrl ?? ImgForEmpty} alt="Game Image" width={60} height={80} />
                          <div className="">
                            <p className="text-sm font-normal text-white">{item?.service?.name}</p>
                            <div className="flex items-center">
                              <span className="text-xs italic"> đ</span>
                              <p className="text-xs font-normal text-white opacity-30">{item.defaultCost} / 1h</p>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-6 2xl:col-span-5">
            <div className="flex flex-col gap-8">
              {selectedService && gameSelected ? (
                <Service data={selectedService} />
              ) : (
                <PersonalIntroduce data={props.data} />
              )}
            </div>
          </div>
          <div className="col-span-4 2xl:col-span-3">
            <div className="sticky flex flex-col gap-3 top-20">
              <div className="relative w-full h-[450px] bg-zinc-800 rounded-3xl p-10">
                <Image
                  className="absolute rounded-xl"
                  layout="fill"
                  objectFit="cover"
                  src={props.data?.avatarUrl ?? ImgForEmpty}
                  alt="Empty Image"
                />
              </div>
              {currentBookingForUserData && (currentBookingForUserData?.length ?? 0) > 0 ? (
                <div className="p-5 mt-5 space-y-5 border border-white rounded-2xl border-opacity-30">
                  <span className="flex items-center justify-center gap-3">
                    Bạn đang trong phiên với:
                    <Link
                      href={`/profile/${
                        (currentBookingForUserData[0].providerService?.provider as any)?.slug
                      }?tab=service`}
                      className="text-lg font-bold hover:underline decoration-solid decoration-2"
                    >
                      {(currentBookingForUserData[0].providerService?.provider as any)?.name}
                    </Link>
                  </span>
                  <div className="text-center bg-gray-700 rounded-full">
                    <BookingCountdown />
                  </div>
                </div>
              ) : (
                <>
                  {userInfo?.id != props.data?.id ? (
                    <div className="flex flex-col gap-5 my-10">
                      <CustomDrawer
                        customOpenBtn={`rounded-full text-purple-700 border-2 border-purple-700 font-semibold text-2xl cursor-pointer hover:scale-105 text-center`}
                        openBtn={
                          <button
                            className="w-full h-full py-2 bg-transparent focus:outline-none"
                            type="button"
                            onClick={handleChatOpen}
                          >
                            {createNewChatChannel.isLoading && (
                              <span
                                className={`spinner h-5 w-5 animate-spin rounded-full border-[3px] border-r-transparent dark:border-navy-300 dark:border-r-transparent border-white`}
                              />
                            )}
                            Chat
                          </button>
                        }
                        token={!!accessToken}
                      >
                        {childrenDrawer}
                      </CustomDrawer>

                      {!props.data?.isBanned && props.data.providerConfig?.status == 'ACTIVATED' && (
                        <CustomDrawer
                          drawerTitle="Xác nhận đặt"
                          customOpenBtn="rounded-full text-white bg-purple-700 font-semibold text-2xl cursor-pointer hover:scale-105 text-center"
                          openBtn={
                            <button
                              className="w-full h-full py-2 bg-transparent focus:outline-none"
                              type="button"
                              onClick={handleOrderOpen}
                            >
                              Thuê
                            </button>
                          }
                          token={!!accessToken}
                        >
                          {childrenDrawer}
                        </CustomDrawer>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid w-screen h-screen grid-cols-10 gap-10 px-10">
          <div className="col-span-2">
            <BGFullGridSkeleton />
          </div>
          <div className="col-span-5">
            <BGFullGridSkeleton />
          </div>
          <div className="col-span-3">
            <BGFullGridSkeleton />
          </div>
        </div>
      )}
    </>
  )
}
export default InformationTab
