import { Button } from '@ume/ui'

import { useCallback, useContext, useEffect, useRef, useState } from 'react'

import { notification } from 'antd'
import { parse } from 'cookie'
import Image from 'next/image'
import Link from 'next/link'
import { BookingHandleRequestStatusEnum } from 'ume-service-openapi'

import { getCurrentBookingForProviderData } from '../detail-profile-page/components/booking-countdown'

import { SocketContext } from '~/components/layouts/app-layout/app-layout'
import { NotificateSkeletonLoader } from '~/components/skeleton-load'
import { TimeFormat } from '~/components/time-format'

import { trpc } from '~/utils/trpc'

const OrderNotificationForProvider = () => {
  const accessToken = parse(document.cookie).accessToken
  const userInfo = JSON.parse(sessionStorage.getItem('user') ?? 'null')

  const { socketContext } = useContext(SocketContext)
  const [page, setPage] = useState<number>(1)
  const limit = '10'
  const [listNotificated, setListNotificated] = useState<any>([])
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const utils = trpc.useContext()

  const { data: getCurrentBookingForProviderData } = trpc.useQuery(['booking.getCurrentBookingForProvider'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    enabled: !!accessToken,
  })

  const {
    data: notificatedData,
    isLoading: loadingNotificated,
    isFetching: fetchingNotificated,
    refetch: refetchNotificated,
  } = trpc.useQuery(['booking.getPendingBookingForProvider'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    onSuccess(data) {
      setListNotificated(data?.data?.row)
    },
    enabled: !!accessToken && userInfo?.isProvider,
  })

  const responeBooking = trpc.useMutation(['booking.putProviderResponeBooking'])

  const handleAcceptBooking = (bookingHistoryId: string, bookerName: string) => {
    if ((getCurrentBookingForProviderData?.data.row?.length ?? 0) > 0 && getCurrentBookingForProviderData?.data?.row) {
      notification.warning({
        message: `Bạn đang trong thời gian phục vụ ${getCurrentBookingForProviderData?.data?.row[0]?.booker?.name}`,
        description: (
          <Link href={`/profile/${getCurrentBookingForProviderData?.data?.row[0]?.booker?.slug}`}>
            Bấm vào đây để tới trang của người thuê
          </Link>
        ),
        placement: 'bottomLeft',
      })
    } else {
      try {
        responeBooking.mutate(
          { bookingHistoryId: bookingHistoryId, status: BookingHandleRequestStatusEnum.ProviderAccept },
          {
            onSuccess: (data) => {
              if (data.success) {
                notification.success({
                  message: 'Yêu cầu đã được chấp nhận!',
                  description: `Bạn đã chấp nhận yêu cầu từ ${bookerName}`,
                  placement: 'bottomLeft',
                })
                utils.invalidateQueries('booking.getPendingBookingForProvider')
                utils.invalidateQueries('booking.getCurrentBookingForProvider')
              }
            },
            onError: (error, data) => {
              console.error(error)
              notification.error({
                message: 'Có lỗi!',
                description: 'Có lỗi trong quá trình chấp nhận. Vui lòng thử lại!',
                placement: 'bottomLeft',
              })
            },
          },
        )
      } catch (error) {
        console.error('Failed to accept booking:', error)
      }
    }
  }

  const handleUnacceptBooking = (bookingHistoryId: string, bookerName: string) => {
    try {
      responeBooking.mutate(
        { bookingHistoryId: bookingHistoryId, status: BookingHandleRequestStatusEnum.ProviderCancel },
        {
          onSuccess: (data) => {
            if (data.success) {
              notification.success({
                message: 'Yêu cầu đã được xóa!',
                description: `Bạn đã từ chối yêu cầu từ ${bookerName}`,
                placement: 'bottomLeft',
              })
              utils.invalidateQueries('booking.getPendingBookingForProvider')
              utils.invalidateQueries('booking.getCurrentBookingForProvider')
            }
          },
          onError: (error) => {
            console.error(error)
            notification.error({
              message: 'Có lỗi!',
              description: 'Có lỗi trong quá trình hủy. Vui lòng thử lại!',
              placement: 'bottomLeft',
            })
          },
        },
      )
    } catch (error) {
      console.error('Failed to cancel booking:', error)
    }
  }

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
    if (containerRef?.current && Boolean(userInfo.id)) {
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
      {Boolean(userInfo.id) ? (
        <>
          {loadingNotificated ? (
            <NotificateSkeletonLoader />
          ) : (
            <>
              {socketContext.socketNotificateContext[0]?.status == 'USER_FINISH_SOON' && (
                <Link
                  href={`/profile/${
                    socketContext.socketNotificateContext[0]?.booker?.slug ??
                    socketContext.socketNotificateContext[0]?.booker?.id
                  }`}
                >
                  <div className="px-2 py-3 border-b-2 border-gray-200 border-opacity-30 rounded-t-lg hover:bg-gray-700 cursor-pointer">
                    <div className="grid grid-cols-10">
                      <div className="col-span-3">
                        <div className="w-[90%] h-full relative rounded-lg">
                          <Image
                            className="rounded-lg"
                            src={socketContext.socketNotificateContext[0]?.booker?.avatarUrl}
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
                              {socketContext.socketNotificateContext[0]?.booker?.name}
                            </p>{' '}
                            đã kết thúc sớm phiên thuê
                          </div>
                        </div>
                        <p className="text-end text-md font-bold opacity-30 space-y-2">
                          {TimeFormat({ date: socketContext.socketNotificateContext[0]?.createdAt })}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
              {listNotificated && listNotificated?.length != 0 ? (
                listNotificated.map((item) => (
                  <div
                    key={item.id}
                    className="px-2 py-3 border-b-2 border-gray-200 border-opacity-30 rounded-t-lg hover:bg-gray-700 cursor-pointer"
                  >
                    <div className="grid grid-cols-10">
                      <div className="col-span-3">
                        <div className="w-[90%] h-full relative rounded-lg">
                          <Image
                            className="rounded-lg"
                            src={item?.booker?.avatarUrl || item?.providerService?.service?.imageUrl}
                            alt="Game Image"
                            layout="fill"
                            objectFit="contain"
                          />
                        </div>
                      </div>
                      <div className="col-span-7">
                        <div className="flex flex-col gap-2">
                          <div className="font-bold truncate">{item?.booker?.name || item?.data?.booker?.name}</div>
                          <div>
                            Đã gửi yêu cầu chơi game{' '}
                            <p className="inline font-bold">
                              {item?.providerService?.service?.name || item?.data?.providerService?.service?.name}
                            </p>{' '}
                            cùng bạn thời gian là:{' '}
                            <p className="inline font-bold">{item?.bookingPeriod || item?.data?.bookingPeriod}h</p>
                          </div>
                        </div>
                        <p className="text-end text-md font-bold opacity-30 space-y-2">
                          {TimeFormat({ date: item?.createdAt })}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-around gap-5 px-3 pt-3">
                      <Button
                        type="button"
                        customCSS="w-[130px] py-2 px-3 font-normal text-center text-white rounded-lg cursor-pointer text-md hover:scale-105"
                        isActive={true}
                        isOutlinedButton={true}
                        onClick={() => handleAcceptBooking(item?.id, item?.booker?.name)}
                        onKeyDown={() => {}}
                        isLoading={responeBooking.isLoading}
                      >
                        Chấp nhận
                      </Button>
                      <Button
                        type="button"
                        isActive={false}
                        isOutlinedButton={true}
                        customCSS="w-[130px] py-2 px-3 font-normal text-center text-purple-700 border-2 border-purple-700 rounded-lg cursor-pointer text-md hover:scale-105"
                        onClick={() => handleUnacceptBooking(item?.id, item?.booker?.name)}
                        onKeyDown={() => {}}
                      >
                        Từ chối
                      </Button>
                    </div>
                  </div>
                ))
              ) : socketContext.socketNotificateContext[0]?.status == 'USER_FINISH_SOON' ? (
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
export default OrderNotificationForProvider
