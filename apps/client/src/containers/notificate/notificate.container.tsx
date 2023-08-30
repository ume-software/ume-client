import { useCallback, useContext, useEffect, useRef, useState } from 'react'

import { notification } from 'antd'
import Image from 'next/image'
import { BookingHandleRequestStatusEnum } from 'ume-openapi-booking'

import { SocketTokenContext } from '~/components/layouts/app-layout/app-layout'
import { NotificateSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

let result: string
const Notificate = (props: { type: string }) => {
  const { socketToken } = useContext(SocketTokenContext)
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
  } = props.type === 'order'
    ? trpc.useQuery(['booking.getCurrentBookingForProvider'], {
        refetchOnWindowFocus: false,
        refetchOnReconnect: 'always',
        cacheTime: 0,
        refetchOnMount: true,
        onSuccess(data) {
          setListNotificated(data?.data?.row)
        },
      })
    : trpc.useQuery(['booking.getAllNotice', { page: String(page), limit: limit }], {
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
              result = bookingHistoryId
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
              result = bookingHistoryId
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
    if (containerRef?.current && socketToken) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const isAtEnd = scrollTop + clientHeight >= scrollHeight

      if (isAtEnd && Number(notificatedData?.data.count) > Number(limit) * Number(page)) {
        setPage(page + 1)
        refetchNotificated().then((data) => {
          setListNotificated((prevData) => [...(prevData || []), ...(data?.data?.data?.row || [])])
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition])

  return (
    <>
      {socketToken ? (
        <>
          {loadingNotificated ? (
            <NotificateSkeletonLoader />
          ) : (
            <>
              {listNotificated && listNotificated?.length != 0 ? (
                listNotificated.map((item) => (
                  <div key={item.id} className="p-2 border-b-2 border-gray-200 rounded-lg hover:bg-violet-100">
                    <div className="grid grid-cols-10">
                      <div className="col-span-3">
                        <div className="w-[90%] h-full relative rounded-lg">
                          <Image
                            className="rounded-lg"
                            src={item?.booker?.avatarUrl || item?.providerSkill?.skill?.imageUrl}
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
                              {item?.providerSkill?.skill?.name || item?.data?.providerSkill?.skill?.name}
                            </p>{' '}
                            cùng bạn thời gian là:{' '}
                            <p className="inline font-bold">{item?.bookingPeriod || item?.data?.bookingPeriod}h</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {item?.id === result && props.type === 'order' ? (
                      <div>Bạn đã xử lý yêu cầu này!</div>
                    ) : (
                      <div className="flex justify-around gap-5 pt-3 px-3">
                        <div
                          className="rounded-lg w-full text-white bg-purple-700 py-1 font-normal text-md hover:scale-105 text-center cursor-pointer"
                          onClick={() => handleAcceptBooking(item?.id, item?.booker?.name)}
                        >
                          Chấp nhận
                        </div>
                        <div
                          className="rounded-lg w-full text-purple-700 border-2 border-purple-700 py-1 font-normal text-md hover:scale-105 text-center cursor-pointer"
                          onClick={() => handleUnacceptBooking(item?.id, item?.booker?.name)}
                        >
                          Từ chối
                        </div>
                      </div>
                    )}
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
export default Notificate
