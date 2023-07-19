import * as socketio from 'socket.io-client'
import { getEnv } from '~/env'

import { getSocket } from '~/utils/constants'

export const socket = (token: string | null) => {
  if (token != null) {
    const socketInstanceBooking = socketio.connect(getEnv().baseBookingURL, {
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: Infinity,
      secure: true,
      rejectUnauthorized: false,
      auth: {
        authorization: `Bearer ${token}`,
      },
    })

    const socketInstanceChatting = socketio.connect(getEnv().baseChattingURL, {
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: Infinity,
      secure: true,
      rejectUnauthorized: false,
      auth: {
        authorization: `Bearer ${token}`,
      },
    })

    return { socketInstanceBooking, socketInstanceChatting }
  } else {
    return null
  }
}
