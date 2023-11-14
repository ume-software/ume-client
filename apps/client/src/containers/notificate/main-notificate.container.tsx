import { useAuth } from '~/contexts/auth'

import { useCallback, useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import { NotificateSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const MainNotificate = () => {
  const { isAuthenticated } = useAuth()
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
  } = trpc.useQuery(['booking.getAllNotice', { page: String(page), limit: limit }], {
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
export default MainNotificate
