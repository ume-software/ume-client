import * as socketio from 'socket.io-client'
import { getEnv } from '~/env'

import React, { createContext } from 'react'

export const socket = (token: string) =>
  socketio.connect(getEnv().baseBookingURL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: Infinity,
    auth: {
      authorization: `bearer ${token}`,
    },
  })
export const SocketContext = createContext<socketio.Socket | null>(null)
