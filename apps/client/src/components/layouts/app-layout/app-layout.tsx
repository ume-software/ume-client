import * as socketio from 'socket.io-client'
import { socket } from '~/api/socket/socket-booking'

import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from 'react'

import { Header } from '~/components/header/header.component'
import { Sidebar } from '~/components/sidebar'

import { getSocket } from '~/utils/constants'

interface AppLayoutProps {
  children: ReactNode
}
interface SocketTokenContextValue {
  socketToken: string | null
  setSocketToken: Dispatch<SetStateAction<string | null>>
}
interface SocketContext {
  socketContext: any[]
  setSocketContext: (value: any[]) => void
}
interface DrawerProps {
  childrenDrawer: ReactNode
  setChildrenDrawer: (children: ReactNode) => void
}

export const SocketTokenContext = createContext<SocketTokenContextValue>({
  socketToken: null,
  setSocketToken: () => {},
})

export const SocketContext = createContext<SocketContext>({
  socketContext: [],
  setSocketContext: () => {},
})

export const drawerContext = createContext<DrawerProps>({
  childrenDrawer: <></>,
  setChildrenDrawer: () => {},
})

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [childrenDrawer, setChildrenDrawer] = useState<ReactNode>()
  const [socketToken, setSocketToken] = useState(null)
  const [socketContext, setSocketContext] = useState<any[]>([])
  const socketInstance = socketToken ? socket(socketToken) : null

  if (socketInstance) {
    socketInstance.on(getSocket().SOCKET_SERVER_EMIT.USER_BOOKING_PROVIDER, (...args) => {
      console.log(args)
      setSocketContext(args)
    })
  }

  const socketContextValue: SocketContext = {
    socketContext,
    setSocketContext,
  }
  return (
    <>
      <SocketTokenContext.Provider value={{ socketToken, setSocketToken }}>
        <SocketContext.Provider value={socketContextValue}>
          <div className="flex flex-col">
            <div className="fixed z-10 flex flex-col w-full ">
              <Header />
            </div>
            <drawerContext.Provider value={{ childrenDrawer, setChildrenDrawer }}>
              <div className="pb-8 bg-umeBackground pt-[90px] pr-[60px] pl-[10px]">{children}</div>
              <div className="fixed h-full bg-umeHeader top-[65px] right-0">
                <Sidebar />
              </div>
            </drawerContext.Provider>
          </div>
        </SocketContext.Provider>
      </SocketTokenContext.Provider>
    </>
  )
}
