// import { Socket, io } from 'socket.io-client'
// import { getEnv } from '~/env'

// import { createContext, useEffect, useMemo } from 'react'

// import { useAuth } from './auth'

// import { getSocket } from '~/utils/constants'

// interface UmeServiceSocketProps {
//   socketUmeService: Socket
//   userBooking: any
//   setUserBooking: any
//   [key: string]: any
// }

// const createSocket = (token: string): Socket =>
//   io(getEnv().baseSocketBookingURL, {
//     reconnection: false,
//     secure: true,
//     rejectUnauthorized: false,
//     auth: {
//       authorization: `Bearer ${token}`,
//     },
//     path: '/ume-service/socket/',
//   })

// const SocketUmeServiceContext = createContext<UmeServiceSocketProps>({
//   socketUmeService: {} as Socket,
// })

// export const SocketUmeServiceProvider = (props: any) => {
//   const { user } = useAuth()
//   let token

//   // if (typeof window !== 'undefined') {
//     token = localStorage.getItem('accessToken')
//   }

//   const socket = createSocket(token)

//   const contextValue = useMemo(() => ({ socket }), [socket])

//   useEffect(() => {
//     socket.on(getSocket().SOCKET_SERVER_EMIT.USER_BOOKING_PROVIDER, (...args) => {
//       setSocketContext((prev) => ({ ...prev, socketNotificateContext: args }))
//     })
//     socket.on(getSocket().SOCKET_SERVER_EMIT.PROVIDER_HANDLED_BOOKING, (...args) => {
//       setSocketContext((prev) => ({ ...prev, socketNotificateContext: args }))
//     })
//     socket.on(getSocket().SOCKET_SERVER_EMIT.ADMIN_HANDLE_KYC, (...args) => {
//       utils.invalidateQueries('identity.identityInfo')
//       setSocketContext((prev) => ({ ...prev, socketNotificateContext: args }))
//     })
//     socket.on(getSocket().SOCKET_SERVER_EMIT.CALL_FROM_CHANNEL, (...args) => {
//       setSocketContext((prev) => ({ ...prev, socketVideoCallContext: args }))
//     })
//   })
// }
