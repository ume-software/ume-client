import * as socketio from 'socket.io-client'
import { getENV } from '~/env'

import React, { createContext } from 'react'

export const socket = (token: string) =>
  socketio.connect(getENV().baseBookingURL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: Infinity,
    auth: {
      authorization: `bearer ${token}`,
    },
  })
export const SocketContext = createContext<socketio.Socket | null>(null)
