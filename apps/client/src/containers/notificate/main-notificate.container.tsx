import SystemImg from 'public/32x32/ume-logo-white.png'

import { useCallback, useEffect, useRef, useState } from 'react'

import { parse } from 'cookie'
import Image from 'next/legacy/image'
import Link from 'next/link'
import { NoticePagingResponse, NoticeResponseTypeEnum } from 'ume-service-openapi'

import { NotificateSkeletonLoader } from '~/components/skeleton-load'
import { TimeFormat } from '~/components/time-format'

import { trpc } from '~/utils/trpc'

interface NotificateTypeProps {
  key: string
  label: string
  [key: string]: any
}

const userInfo = JSON.parse(sessionStorage.getItem('user') ?? 'null')

const notificate: NotificateTypeProps[] = [
  {
    key: NoticeResponseTypeEnum.AdminHasApprovedKycRequest,
    label: 'KYC của bạn đã được chấp nhận',
    link: `/account-setting?user=${userInfo?.name}&tab=settingInformation`,
  },
  { key: NoticeResponseTypeEnum.AdminHasBannedProvider, label: 'Tài khoản nhà cung cấp của bạn đã bị chặn' },
  {
    key: NoticeResponseTypeEnum.AdminHasCompletedWithdrawalRequest,
    label: 'Yêu cầu rút tiền của bạn đã được hoàn thành',
    link: `/account-setting?user=${userInfo?.name}&tab=withdraw`,
  },
  {
    key: NoticeResponseTypeEnum.AdminHasRejectedKycRequest,
    label: 'KYC của bạn đã bị từ chối',
    link: `/account-setting?user=${userInfo?.name}&tab=settingInformation`,
  },
  {
    key: NoticeResponseTypeEnum.AdminHasRejectedWithdrawalRequest,
    label: 'Yêu cầu rút tiền của bạn đã bị từ chối',
    link: `/account-setting?user=${userInfo?.name}&tab=withdraw`,
  },
  {
    key: NoticeResponseTypeEnum.AdminHasUnBannedProvider,
    label: 'Tài khoản nhà cung cấp của bạn đã được mở khóa',
    link: `/profile/${userInfo?.slug ?? userInfo?.id}?tab=${userInfo?.isProvider ? 'Service' : 'Album'}`,
  },
  {
    key: NoticeResponseTypeEnum.BookingHasBeenDeclined,
    label: 'Đơn thuê của bạn đã bị từ chối',
    link: `/profile/`,
  },
  {
    key: NoticeResponseTypeEnum.BookingHasBeenSucceeded,
    label: 'Đơn thuê của bạn đã được chấp nhận',
    link: `/profile/`,
  },
  { key: NoticeResponseTypeEnum.HaveBooking, label: 'Có yêu cầu thuê mới được gửi tới', link: `/profile/` },
  { key: NoticeResponseTypeEnum.NewMessage, label: 'Bạn có tin nhắn mới' },
  { key: NoticeResponseTypeEnum.SomeoneFollowingYou, label: 'đã theo dõi bạn', link: `/profile/` },
]

const MainNotificate = () => {
  const accessToken = parse(document.cookie).accessToken

  const [page, setPage] = useState<number>(1)
  const limit = '10'
  const [listNotificated, setListNotificated] = useState<NoticePagingResponse['row']>([])
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
      {!!accessToken ? (
        <>
          {loadingNotificated ? (
            <NotificateSkeletonLoader />
          ) : (
            <>
              {listNotificated && listNotificated?.length != 0 ? (
                listNotificated.map((item) => (
                  <div
                    key={item.id}
                    className="px-2 py-3 border-b-2 border-gray-200 border-opacity-30 rounded-t-lg hover:bg-gray-700 cursor-pointer"
                  >
                    <Link
                      href={`${notificate.find((notiTitle) => notiTitle.key == item.type)?.link}${
                        !(userInfo?.id == (item?.data as any)?.booker?.id)
                          ? (item?.data as any)?.booker?.slug ?? (item?.data as any)?.booker?.id
                          : (item?.data as any)?.providerService?.provider?.slug ??
                            (item?.data as any)?.providerService?.provider?.id
                      } `}
                    >
                      <div className="grid grid-cols-10">
                        <div className="col-span-3">
                          <div className="w-[75px] h-[75px] relative rounded-full">
                            <Image
                              className="rounded-lg"
                              src={
                                (item?.data as any)?.booker?.avatarUrl ??
                                (item?.data as any)?.providerService?.provider?.avatarUrl ??
                                SystemImg
                              }
                              alt="Game Image"
                              layout="fill"
                            />
                          </div>
                        </div>
                        <div className="col-span-7">
                          <div className="flex flex-col">
                            <div className="font-bold truncate">
                              {userInfo?.id == item.userId
                                ? (item?.data as any)?.booker?.name
                                : (item?.data as any)?.providerService?.provider?.name}
                            </div>
                            <div>{notificate.find((notiTitle) => notiTitle.key == item.type)?.label}</div>
                          </div>
                          <p className="text-end text-md font-bold opacity-30">
                            {TimeFormat({ date: item?.createdAt })}
                          </p>
                        </div>
                      </div>
                    </Link>
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
