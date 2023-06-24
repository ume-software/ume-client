import * as socketio from 'socket.io-client'
import { socket } from '~/api/socket/socket-connect'

import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from 'react'

import { UserInfomationResponse } from 'ume-identity-service-openapi'

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

interface socketClientEmit {
  [key: string]: any
}
interface SocketContext {
  socketNotificateContext: any[]
  socketChattingContext: any[]
  socketLivestreamContext: any[]
}
interface DrawerProps {
  childrenDrawer: ReactNode
  setChildrenDrawer: (children: ReactNode) => void
}

interface UserContextValue {
  userContext: UserInfomationResponse | null
  setUserContext: Dispatch<SetStateAction<UserInfomationResponse | null>>
}
export const SocketTokenContext = createContext<SocketTokenContextValue>({
  socketToken: null,
  setSocketToken: () => {},
})

export const SocketClientEmit = createContext<socketClientEmit>({
  socketInstanceChatting: null,
})

export const SocketContext = createContext<SocketContext>({
  socketNotificateContext: [],
  socketChattingContext: [],
  socketLivestreamContext: [],
})

export const DrawerContext = createContext<DrawerProps>({
  childrenDrawer: <></>,
  setChildrenDrawer: () => {},
})

export const UserContext = createContext<UserContextValue>({
  userContext: null,
  setUserContext: () => {},
})

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [childrenDrawer, setChildrenDrawer] = useState<ReactNode>()
  const [userContext, setUserContext] = useState(null)
  const [socketToken, setSocketToken] = useState(null)

  const [socketClientEmit, setSocketClientEmit] = useState<socketClientEmit>({ socketInstanceChatting: null })

  const [socketContext, setSocketContext] = useState<SocketContext>({
    socketNotificateContext: [],
    socketChattingContext: [],
    socketLivestreamContext: [],
  })

  useEffect(() => {
    if (socketToken) {
      const socketInstance = socketToken ? socket(socketToken) : null
      setSocketClientEmit({ socketInstanceChatting: socketInstance?.socketInstanceChatting })

      if (socketInstance?.socketInstanceBooking) {
        socketInstance.socketInstanceBooking.on(getSocket().SOCKET_SERVER_EMIT.USER_BOOKING_PROVIDER, (...args) => {
          setSocketContext((prev) => ({ ...prev, socketNotificateContext: args }))
        })
      }
      if (socketInstance?.socketInstanceChatting) {
        socketInstance.socketInstanceChatting.on(
          getSocket().SOCKER_CHATTING_SERVER_EMIT.MESSAGE_FROM_CHANNEL,
          (...args) => {
            setSocketContext((prev) => ({ ...prev, socketChattingContext: args }))
          },
        )
      }

      return () => {
        if (socketInstance?.socketInstanceBooking) {
          socketInstance.socketInstanceBooking.off(getSocket().SOCKET_SERVER_EMIT.USER_BOOKING_PROVIDER)
        }
        if (socketInstance?.socketInstanceChatting) {
          socketInstance.socketInstanceChatting.off(getSocket().SOCKER_CHATTING_SERVER_EMIT.MESSAGE_FROM_CHANNEL)
        }
      }
    }
  }, [socketToken])

  return (
    <>
      <UserContext.Provider value={{ setUserContext, userContext }}>
        <SocketTokenContext.Provider value={{ socketToken, setSocketToken }}>
          <SocketClientEmit.Provider value={{ socketClientEmit }}>
            <SocketContext.Provider value={socketContext}>
              <div className="flex flex-col">
                <div className="fixed z-10 flex flex-col w-full ">
                  <Header />
                </div>
                <DrawerContext.Provider value={{ childrenDrawer, setChildrenDrawer }}>
                  <div className="pb-8 bg-umeBackground pt-[90px] pr-[60px] pl-[10px]">{children}</div>
                  <div className="fixed h-full bg-umeHeader top-[65px] right-0">
                    <Sidebar />
                  </div>
                </DrawerContext.Provider>
              </div>
            </SocketContext.Provider>
          </SocketClientEmit.Provider>
        </SocketTokenContext.Provider>
      </UserContext.Provider>
    </>
  )
}
