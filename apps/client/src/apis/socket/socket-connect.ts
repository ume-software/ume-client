import * as socketio from 'socket.io-client'
import { getEnv } from '~/env'

export const socket = (token: string | null) => {
  if (token != null) {
    const socketInstanceBooking = socketio.connect(getEnv().baseSocketBookingURL, {
      reconnectionAttempts: Infinity,
      secure: true,
      rejectUnauthorized: false,
      auth: {
        authorization: `Bearer ${token}`,
      },
      path: '/ume-service/socket/',
    })

    const socketInstanceChatting = socketio.connect(getEnv().baseSocketChattingURL, {
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
