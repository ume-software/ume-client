import { Socket, io } from 'socket.io-client'
import { getEnv } from '~/env'

import { createContext } from 'react'

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

const SocketUmeServiceContext = createContext({})
