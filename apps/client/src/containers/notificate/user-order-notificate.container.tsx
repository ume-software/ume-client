import { useCallback, useContext, useEffect, useRef, useState } from 'react'

import { parse } from 'cookie'
import Image from 'next/image'
import Link from 'next/link'

import { SocketContext } from '~/components/layouts/app-layout/app-layout'
import { NotificateSkeletonLoader } from '~/components/skeleton-load'
import { TimeFormat } from '~/components/time-format'

import { trpc } from '~/utils/trpc'

const OrderNotificationForUser = () => {
  const accessToken = parse(document.cookie).accessToken
  const userInfo = JSON.parse(sessionStorage.getItem('user') ?? 'null')

  const { socketContext } = useContext(SocketContext)
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
              {socketContext.socketNotificateContext[0]?.status == 'PROVIDER_ACCEPT' && (
                <Link
                  href={`/profile/${socketContext.socketNotificateContext[0]?.providerService?.provider?.slug}?tab=service&service=${socketContext.socketNotificateContext[0]?.providerService?.service?.slug}`}
                >
                  <div className="px-2 py-3 border-b-2 border-gray-200 border-opacity-30 rounded-t-lg hover:bg-gray-700 cursor-pointer">
                    <div className="grid grid-cols-10">
                      <div className="col-span-3">
                        <div className="w-[90%] h-full relative rounded-lg">
                          <Image
                            className="rounded-lg"
                            src={socketContext.socketNotificateContext[0]?.providerService?.provider?.avatarUrl}
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
                              {socketContext.socketNotificateContext[0]?.providerService?.provider?.name}
                            </p>{' '}
                            đã chấp nhận yêu cầu chơi game với bạn với thời gian là:{' '}
                            <p className="inline font-bold">
                              {socketContext.socketNotificateContext[0]?.bookingPeriod ||
                                socketContext.socketNotificateContext[0]?.data?.bookingPeriod}
                              h
                            </p>
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
                  <Link
                    key={item.id}
                    href={`/profile/${item.providerService.provider.slug}?tab=service&service=${item?.providerService?.service?.slug}`}
                  >
                    <div className="px-2 py-3 border-b-2 border-gray-200 border-opacity-30 rounded-t-lg hover:bg-gray-700 cursor-pointer">
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
                          <p className="text-end text-md font-bold opacity-30 space-y-2">
                            {TimeFormat({ date: item?.createdAt })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : socketContext.socketNotificateContext[0]?.status == 'PROVIDER_ACCEPT' ? (
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
