import { Socket, io } from 'socket.io-client'
import { getEnv } from '~/env'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { BookingHistoryResponse } from 'ume-service-openapi'

import { useAuth } from './auth'

import { getSocket } from '~/utils/constants'

interface UmeServiceSocketProps {
  socketUmeService: Socket
  userBooking: BookingHistoryResponse[]
  setUserBooking?: (newBooking: BookingHistoryResponse[]) => void
  adminHandleKYC: any
  setAdminHandleKYC?: (adminRes: any) => void
  callingFormOtherUser: any
  setCallingFormOtherUser?: (newCall: any) => void
  [key: string]: any
}

const createSocket = (token: string): Socket =>
  io(getEnv().baseSocketBookingURL, {
    reconnection: false,
    secure: true,
    rejectUnauthorized: false,
    auth: {
      authorization: `Bearer ${token}`,
    },
    path: '/ume-service/socket/',
  })

const SocketUmeServiceContext = createContext<UmeServiceSocketProps>({
  socketUmeService: {} as Socket,
  userBooking: [],
  setUserBooking: () => false,
  adminHandleKYC: [],
  setAdminHandleKYC: () => false,
  callingFormOtherUser: [],
  setCallingFormOtherUser: () => false,
})

export const SocketUmeServiceProvider = (props: any) => {
  const { user } = useAuth()
  let token

  const [userBooking, setUserBooking] = useState<BookingHistoryResponse[]>([])
  const [adminHandleKYC, setAdminHandleKYC] = useState<any>([])
  const [callingFormOtherUser, setCallingFormOtherUser] = useState<any>([])

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken')
  }

  const socketUmeService = createSocket(token)

  const contextValue = useMemo(
    () => ({
      socketUmeService,
      userBooking,
      setUserBooking: (newBooking: BookingHistoryResponse[]) => setUserBooking(newBooking),
      adminHandleKYC,
      setAdminHandleKYC: (adminRes: any) => setAdminHandleKYC(adminRes),
      callingFormOtherUser,
      setCallingFormOtherUser: (newCall: any) => setCallingFormOtherUser(newCall),
    }),
    [socketUmeService, userBooking, adminHandleKYC, callingFormOtherUser],
  )

  useEffect(() => {
    socketUmeService.on(getSocket().SOCKET_SERVER_EMIT.USER_BOOKING_PROVIDER, (...args) => {
      setUserBooking({ ...args })
    })
    socketUmeService.on(getSocket().SOCKET_SERVER_EMIT.PROVIDER_HANDLED_BOOKING, (...args) => {
      setUserBooking({ ...args })
    })
    socketUmeService.on(getSocket().SOCKET_SERVER_EMIT.ADMIN_HANDLE_KYC, (...args) => {
      setAdminHandleKYC({ ...args })
    })
    socketUmeService.on(getSocket().SOCKET_SERVER_EMIT.CALL_FROM_CHANNEL, (...args) => {
      setCallingFormOtherUser({ ...args })
    })
  }, [socketUmeService, user])

  useEffect(() => {
    return () => {
      socketUmeService.disconnect()
    }
  }, [socketUmeService])

  return <SocketUmeServiceContext.Provider value={contextValue}>{props.children}</SocketUmeServiceContext.Provider>
}

export const useUmeServiceSockets = () => useContext(SocketUmeServiceContext)
