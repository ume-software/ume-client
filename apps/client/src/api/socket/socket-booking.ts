import * as socketio from 'socket.io-client'
import { getEnv } from '~/env'

import { Dispatch, SetStateAction, createContext } from 'react'

import { getSocket } from '~/utils/constants'

interface SocketTokenContextValue {
  socketToken: string | null
  setSocketToken: Dispatch<SetStateAction<string | null>>
}
export const socketTokenContext = createContext<SocketTokenContextValue>({
  socketToken: null,
  setSocketToken: () => {},
})

export const socket = (token: string | null) => {
  if (token != null) {
    const socketInstance = socketio
      .connect(getEnv().baseBookingURL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: Infinity,
        auth: {
          authorization: `bearer ${token}`,
        },
      })
      .on(getSocket().SOCKET_EVENT.CONNECTION, () => console.log('connection'))
    return socketInstance
  } else {
    return null
  }
}
export const SocketContext = createContext<socketio.Socket | null>(null)
