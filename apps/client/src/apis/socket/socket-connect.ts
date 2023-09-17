import * as socketio from 'socket.io-client'
import { getEnv } from '~/env'

import { getSocket } from '~/utils/constants'

export const socket = (token: string | null) => {
  if (token != null) {
    const socketInstanceBooking = socketio.connect(getEnv().baseSocketBookingURL, {
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: Infinity,
      secure: true,
      rejectUnauthorized: false,
      auth: {
        authorization: `Bearer ${token}`,
      },
      path: '/booking-service/socket/',
    })

    const socketInstanceChatting = socketio.connect(getEnv().baseSocketChattingURL, {
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: Infinity,
      secure: true,
      rejectUnauthorized: false,
      auth: {
        authorization: `Bearer ${token}`,
      },
      path: '/chatting-service/socket/',
    })

    return { socketInstanceBooking, socketInstanceChatting }
  } else {
    return null
  }
}