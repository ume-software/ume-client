import ImgForEmpty from 'public/img-for-empty.png'
import { useUmeServiceSockets } from '~/contexts/ume-service-context'

import { useCallback, useEffect, useRef, useState } from 'react'

import { parse } from 'cookie'
import { isNil } from 'lodash'
import Image from 'next/image'
import Link from 'next/link'
import { UserInformationResponse } from 'ume-service-openapi'

import { NotificateSkeletonLoader } from '~/components/skeleton-load'
import { TimeFormat } from '~/components/time-format'

import { trpc } from '~/utils/trpc'

const OrderNotificationForUser = () => {
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
  const { userBooking } = useUmeServiceSockets()
  const [page, setPage] = useState<number>(1)
  const limit = '10'
  const [listNotificated, setListNotificated] = useState<any>([])
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    data: notificatedData,
    isLoading: loadingNotificated,
    isFetching: fetchingNotificated,
    refetch: refetchNotificated,
  } = trpc.useQuery(['booking.getPendingBookingForUser'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    onSuccess(data) {
      setListNotificated(data?.data?.row)
    },
    enabled: !!accessToken,
  })

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onScroll = useCallback(() => {
    const { scrollY } = window
    setScrollPosition(scrollY)
  }, [])

  useEffect(() => {
    if (containerRef?.current && Boolean(userInfo?.id)) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const isAtEnd = scrollTop + clientHeight >= scrollHeight

      if (isAtEnd && Number(notificatedData?.data.count) > Number(limit) * Number(page)) {
        setPage(page + 1)
        refetchNotificated().then((data) => {
          setListNotificated((prevData) => [...(prevData ?? []), ...(data?.data?.data?.row ?? [])])
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition])

  return (
    <>
      {Boolean(userInfo?.id) ? (
        <>
          {loadingNotificated ? (
            <NotificateSkeletonLoader />
          ) : (
            <>
              {userBooking && userBooking[0]?.status == 'PROVIDER_ACCEPT' && (
                <Link
                  href={`/profile/${
                    userBooking && (userBooking[0]?.providerService?.provider as any)?.slug
                  }?tab=service&service=${userBooking[0]?.providerService?.service?.slug}`}
                >
                  <div className="px-2 py-3 border-b-2 border-gray-200 rounded-t-lg cursor-pointer border-opacity-30 hover:bg-gray-700">
                    <div className="grid grid-cols-10">
                      <div className="col-span-3">
                        <div className="w-[90%] h-full relative rounded-lg">
                          <Image
                            className="rounded-lg"
                            src={
                              (userBooking && (userBooking[0]?.providerService?.provider as any)?.avatarUrl) ??
                              ImgForEmpty
                            }
                            alt="Game Image"
                            layout="fill"
                            objectFit="contain"
                          />
                        </div>
                      </div>
                      <div className="col-span-7">
                        <div className="flex flex-col gap-2">
                          <div>
                            <p className="inline font-bold">
                              {' '}
                              {userBooking && (userBooking[0]?.providerService?.provider as any)?.name}
                            </p>{' '}
                            đã chấp nhận yêu cầu thuê của bạn với thời gian là:{' '}
                            <p className="inline font-bold">
                              {(userBooking && userBooking[0]?.bookingPeriod) ||
                                (userBooking && (userBooking[0] as any)?.data?.bookingPeriod)}
                              h
                            </p>
                          </div>
                        </div>
                        <p className="space-y-2 font-bold text-end text-md opacity-30">
                          {TimeFormat({
                            date: userBooking && userBooking[0]?.createdAt,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
              {listNotificated && listNotificated?.length != 0 ? (
                listNotificated.map((item) => (
                  <Link
                    key={item.id}
                    href={`/profile/${item.providerService.provider.slug}?tab=service&service=${item?.providerService?.service?.slug}`}
                  >
                    <div className="px-2 py-3 border-b-2 border-gray-200 rounded-t-lg cursor-pointer border-opacity-30 hover:bg-gray-700">
                      <div className="grid grid-cols-10">
                        <div className="col-span-3">
                          <div className="w-[90%] h-full relative rounded-lg">
                            <Image
                              className="rounded-lg"
                              src={item?.providerService?.provider?.avatarUrl}
                              alt="Game Image"
                              layout="fill"
                              objectFit="contain"
                            />
                          </div>
                        </div>
                        <div className="col-span-7">
                          <div className="flex flex-col gap-2">
                            <div>
                              Bạn đã gửi yêu cầu chơi game{' '}
                              <p className="inline font-bold">{item?.providerService?.service?.name}</p> tới{' '}
                              <p className="inline font-bold"> {item?.providerService?.provider?.name}</p> với thời gian
                              là:{' '}
                              <p className="inline font-bold">{item?.bookingPeriod || item?.data?.bookingPeriod}h</p>
                            </div>
                          </div>
                          <p className="space-y-2 font-bold text-end text-md opacity-30">
                            {TimeFormat({ date: item?.createdAt })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : userBooking && userBooking[0]?.status == 'PROVIDER_ACCEPT' ? (
                <></>
              ) : (
                <div>Chưa có thông báo mới!</div>
              )}
            </>
          )}
          {loadingNotificated && fetchingNotificated && <NotificateSkeletonLoader />}
        </>
      ) : (
        <div>Chưa có thông báo mới!</div>
      )}
    </>
  )
}
export default OrderNotificationForUser
