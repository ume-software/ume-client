import * as socketio from 'socket.io-client'
import { getEnv } from '~/env'

export const socket = (token: string | null) => {
  if (token != null) {
    const socketInstanceBooking = socketio.connect(getEnv().baseSocketBookingURL, {
      reconnection: false,
      secure: true,
      rejectUnauthorized: false,
      auth: {
        authorization: `Bearer ${token}`,
      },
      path: '/ume-service/socket/',
    })

    return { socketInstanceBooking }
  } else {
    return null
  }
}
