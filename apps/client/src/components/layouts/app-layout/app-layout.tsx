import { socket } from '~/apis/socket/socket-connect'
import { useAuth } from '~/contexts/auth'

import {
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { parse } from 'cookie'

import { Header } from '~/components/header/header.component'
import { Sidebar } from '~/components/sidebar'

import { getSocket } from '~/utils/constants'

type AppLayoutProps = PropsWithChildren

interface SocketClientEmit {
  [key: string]: any
}
interface SocketContext {
  socketContext: {
    socketNotificateContext: any[]
    socketChattingContext: any[]
    socketLivestreamContext: any[]
  }
  setSocketContext: Dispatch<
    SetStateAction<{ socketNotificateContext: any[]; socketChattingContext: any[]; socketLivestreamContext: any[] }>
  >
}
interface DrawerProps {
  childrenDrawer: ReactNode
  setChildrenDrawer: (children: ReactNode) => void
}

export const SocketClientEmit = createContext<SocketClientEmit>({
  socketInstanceChatting: null,
})

export const SocketContext = createContext<SocketContext>({
  socketContext: {
    socketNotificateContext: [],
    socketChattingContext: [],
    socketLivestreamContext: [],
  },
  setSocketContext: () => {},
})

export const DrawerContext = createContext<DrawerProps>({
  childrenDrawer: <></>,
  setChildrenDrawer: () => {},
})

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const userInfo = JSON.parse(sessionStorage.getItem('user') ?? 'null')
  const accessToken = parse(document.cookie).accessToken
  const { isAuthenticated } = useAuth()

  const [childrenDrawer, setChildrenDrawer] = useState<ReactNode>()

  const [socketClientEmit, setSocketClientEmit] = useState<SocketClientEmit>({ socketInstanceChatting: null })

  const [socketContext, setSocketContext] = useState<SocketContext['socketContext']>({
    socketNotificateContext: [],
    socketChattingContext: [],
    socketLivestreamContext: [],
  })

  useEffect(() => {
    if (!!accessToken && isAuthenticated) {
      const socketInstance = Boolean(userInfo.id) ? socket(accessToken) : null

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, isAuthenticated])

  const socketClientEmitValue = useMemo(
    () => ({ socketClientEmit, socketContext, setSocketContext, childrenDrawer, setChildrenDrawer }),
    [socketClientEmit, socketContext, setSocketContext, childrenDrawer, setChildrenDrawer],
  )
  return (
    <SocketClientEmit.Provider value={socketClientEmitValue}>
      <SocketContext.Provider value={socketClientEmitValue}>
        <div className="flex flex-col">
          <div className="fixed z-10 flex flex-col w-full ">
            <Header />
          </div>
          <DrawerContext.Provider value={socketClientEmitValue}>
            <div className="pb-8 bg-umeBackground pt-[90px] pr-[60px] pl-[10px]">{children}</div>
            <div className="fixed h-full bg-umeHeader top-[65px] right-0">
              <Sidebar />
            </div>
          </DrawerContext.Provider>
        </div>
      </SocketContext.Provider>
    </SocketClientEmit.Provider>
  )
}
