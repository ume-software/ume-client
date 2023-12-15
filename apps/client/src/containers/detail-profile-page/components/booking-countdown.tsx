import { useEffect, useState } from 'react'

import { isNil } from 'lodash'
import { BookingHistoryPagingResponse, UserInformationResponse } from 'ume-service-openapi'

import { trpc } from '~/utils/trpc'

const getCurrentBookingForUserData = (): BookingHistoryPagingResponse['row'] | undefined => {
  const accessToken = localStorage.getItem('accessToken')
  const { data: getCurrentBookingForUserData } = trpc.useQuery(['booking.getCurrentBookingForUser'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    enabled: !!accessToken,
  })
  return getCurrentBookingForUserData?.data.row
}

const getCurrentBookingForProviderData = (): BookingHistoryPagingResponse['row'] | undefined => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [userInfo, setUserInfo] = useState<UserInformationResponse | undefined>(undefined)
  trpc.useQuery(['identity.identityInfo'], {
    onSuccess(data) {
      setUserInfo(data.data)
    },
    onError() {
      localStorage.removeItem('accessToken')
    },
    enabled: isNil(userInfo),
  })
  const accessToken = localStorage.getItem('accessToken')

  const { data: getCurrentBookingForProviderData } = trpc.useQuery(['booking.getCurrentBookingForProvider'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    enabled: !!accessToken && userInfo?.isProvider,
  })

  return getCurrentBookingForProviderData?.data.row
}

const BookingCountdown = () => {
  const currentBookingForProviderData: BookingHistoryPagingResponse['row'] | undefined =
    getCurrentBookingForProviderData()
  const currentBookingForUserData: BookingHistoryPagingResponse['row'] | undefined = getCurrentBookingForUserData()

  const formatTime = (time: number): string => {
    return time < 10 ? `0${time}` : `${time}`
  }

  const bookingPeriodCount = () => {
    const timeStamp = new Date(
      currentBookingForProviderData?.[0]?.updatedAt ?? currentBookingForUserData?.[0]?.updatedAt ?? '',
    )
    const endHours =
      (timeStamp.getHours() +
        (currentBookingForProviderData?.[0]?.bookingPeriod ?? currentBookingForUserData?.[0]?.bookingPeriod ?? 0)) *
        3600 +
      timeStamp.getMinutes() * 60 +
      timeStamp.getSeconds()
    const currentHours = new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds()

    const remainingTimeInSeconds = endHours - currentHours

    if (remainingTimeInSeconds > 0) {
      const hours = Math.floor(remainingTimeInSeconds / 3600)
      const minutes = Math.floor((remainingTimeInSeconds % 3600) / 60)
      const seconds = remainingTimeInSeconds % 60

      return `${formatTime(hours)}h: ${formatTime(minutes)}m: ${formatTime(seconds)}s`
    } else {
      return 0
    }
  }

  const bookingData = currentBookingForProviderData?.[0]

  const [remainingTime, setRemainingTime] = useState(() => bookingPeriodCount())

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newRemainingTime = bookingPeriodCount()
      setRemainingTime(newRemainingTime)
    }, 1000)

    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingData, currentBookingForUserData, currentBookingForProviderData])

  return <div className="p-2 text-center bg-gray-700 rounded-full">Thời gian còn lại: {remainingTime}</div>
}
export { BookingCountdown, getCurrentBookingForUserData, getCurrentBookingForProviderData }
