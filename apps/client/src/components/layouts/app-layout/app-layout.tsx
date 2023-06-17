import * as socketio from 'socket.io-client'
import { socket } from '~/api/socket/socket-booking'
import { socketChatting } from '~/api/socket/socket-chatting'

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
  }
  setSocketContext: (value: any[]) => void
}
// interface SocketChattingContext {
//   socketChattingContext: any[]
//   setSocketChattingContext: (value: any[]) => void
// }
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
  },
  setSocketContext: () => {},
})

// export const SocketChattingContext = createContext<SocketChattingContext>({
//   socketChattingContext: [],
//   setSocketChattingContext: () => {},
// })

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
  })

  const socketInstance = socketToken ? socket(socketToken) : null
  const socketChattingInstance = socketToken ? socketChatting(socketToken) : null

  if (socketInstance) {
    console.log('socketInstance ====>', socketInstance)

    socketInstance.on(getSocket().SOCKET_SERVER_EMIT.USER_BOOKING_PROVIDER, (...args) => {
      setSocketContext((prev) => ({ ...prev, socketNotificateContext: args }))
    })
  }
  if (socketChattingInstance) {
    console.log('socketChattingInstance ====>', socketChattingInstance)
    socketChattingInstance.on(getSocket().SOCKER_CHATTING_SERVER_EMIT.MESSAGE_FROM_CHANNEL, (...args) => {
      setSocketContext((prev) => ({ ...prev, socketChattingContext: args }))
    })
  }

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
