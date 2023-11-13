import { useAuth } from '~/contexts/auth'

import { useCallback, useEffect, useRef, useState } from 'react'

import { notification } from 'antd'
import Image from 'next/image'
import { BookingHandleRequestStatusEnum } from 'ume-service-openapi'

import { NotificateSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const OrderNotificate = () => {
  const { isAuthenticated } = useAuth()
  const [page, setPage] = useState<number>(1)
  const limit = '10'
  const [listNotificated, setListNotificated] = useState<any>([])
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const utils = trpc.useContext()

  const {
    data: notificatedData,
    isLoading: loadingNotificated,
    isFetching: fetchingNotificated,
    refetch: refetchNotificated,
  } = trpc.useQuery(['booking.getCurrentBookingForProvider'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    onSuccess(data) {
      setListNotificated(data?.data?.row)
    },
  })

  const responeBooking = trpc.useMutation(['booking.putProviderResponeBooking'])

  const handleAcceptBooking = (bookingHistoryId: string, bookerName: string) => {
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
    if (containerRef?.current && isAuthenticated) {
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
      {isAuthenticated ? (
        <>
          {loadingNotificated ? (
            <NotificateSkeletonLoader />
          ) : (
            <>
              {listNotificated && listNotificated?.length != 0 ? (
                listNotificated.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 border-b-2 border-gray-200 rounded-lg hover:bg-violet-100 custom-scrollbar"
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
                      </div>
                    </div>
                    <div className="flex justify-around gap-5 px-3 pt-3">
                      <div
                        className="w-full py-1 font-normal text-center text-white bg-purple-700 rounded-lg cursor-pointer text-md hover:scale-105"
                        onClick={() => handleAcceptBooking(item?.id, item?.booker?.name)}
                        onKeyDown={() => {}}
                      >
                        Chấp nhận
                      </div>
                      <div
                        className="w-full py-1 font-normal text-center text-purple-700 border-2 border-purple-700 rounded-lg cursor-pointer text-md hover:scale-105"
                        onClick={() => handleUnacceptBooking(item?.id, item?.booker?.name)}
                        onKeyDown={() => {}}
                      >
                        Từ chối
                      </div>
                    </div>
                  </div>
                ))
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
export default OrderNotificate