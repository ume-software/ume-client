import { useCallback, useEffect, useRef, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { NotificateSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const OrderNotificationForUser = () => {
  const userInfo = JSON.parse(sessionStorage.getItem('user') ?? 'null')
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
                        </div>
                      </div>
                    </div>
                  </Link>
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
export default OrderNotificationForUser
