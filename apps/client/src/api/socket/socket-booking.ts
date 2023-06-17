import * as socketio from 'socket.io-client'
import { getEnv } from '~/env'

import { getSocket } from '~/utils/constants'

export const socket = (token: string | null) => {
  if (token != null) {
    const socketInstance = { ...socketio }
      .connect(getEnv().baseBookingURL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: Infinity,
        auth: {
          authorization: `Bearer ${token}`,
        },
      })
      .on(getSocket().SOCKET_EVENT.CONNECTION, () => console.log('connection'))
    return socketInstance
  } else {
    return null
  }
}
