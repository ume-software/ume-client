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
interface SocketContext {
  socketContext: {
    socketNotificateContext: any[]
    socketChattingContext: any[]
    socketLivestreamContext: any[]
  }
  setSocketContext: (value: any[]) => void
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

export const SocketContext = createContext<SocketContext>({
  socketContext: {
    socketNotificateContext: [],
    socketChattingContext: [],
    socketLivestreamContext: [],
  },
  setSocketContext: () => {},
})

export const drawerContext = createContext<DrawerProps>({
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
  const [socketContext, setSocketContext] = useState<any>({
    socketNotificateContext: [],
    socketChattingContext: [],
    socketLivestreamContext: [],
  })

  const socketInstance = socketToken ? socket(socketToken) : null
  useEffect(() => {
    if (socketInstance?.socketInstance) {
      console.log('socketInstance ====>', socketInstance.socketInstance)

      socketInstance?.socketInstance.on(getSocket().SOCKET_SERVER_EMIT.USER_BOOKING_PROVIDER, (...args) => {
        setSocketContext((prev) => ({ ...prev, socketNotificateContext: args }))
        socketInstance?.socketInstance.off(getSocket().SOCKET_SERVER_EMIT.USER_BOOKING_PROVIDER)
      })
    }
    if (socketInstance?.socketInstanceChatting) {
      console.log('socketChattingInstance ====>', socketInstance?.socketInstanceChatting)
      socketInstance?.socketInstanceChatting.once(
        getSocket().SOCKER_CHATTING_SERVER_EMIT.MESSAGE_FROM_CHANNEL,
        (...args) => {
          setSocketContext((prev) => ({ ...prev, socketChattingContext: args }))
          socketInstance?.socketInstanceChatting.off(getSocket().SOCKER_CHATTING_SERVER_EMIT.MESSAGE_FROM_CHANNEL)
        },
      )
    }

    return () => {
      socketInstance?.socketInstance.off(getSocket().SOCKET_SERVER_EMIT.USER_BOOKING_PROVIDER)
      socketInstance?.socketInstanceChatting.off(getSocket().SOCKER_CHATTING_SERVER_EMIT.MESSAGE_FROM_CHANNEL)
      socketInstance?.socketInstance.close()
      socketInstance?.socketInstanceChatting.close()
    }
  }, [socketInstance?.socketInstance, socketInstance?.socketInstanceChatting])
  // if (socketInstance?.socketInstanceLivestream) {
  //   console.log('socketLivestreamInstance ====>', socketInstance?.socketInstanceLivestream)
  //   socketInstance?.socketInstanceLivestream.on(
  //     getSocket().SOCKER_CHATTING_SERVER_EMIT.MESSAGE_FROM_CHANNEL,
  //     (...args) => {
  //       setSocketContext((prev) => ({ ...prev, socketLivestreamContext: args }))
  //     },
  //   )
  // }

  const socketContextValue: SocketContext = {
    socketContext,
    setSocketContext,
  }

  return (
    <>
      <UserContext.Provider value={{ setUserContext, userContext }}>
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
      </UserContext.Provider>
    </>
  )
}
