import NotiSound from 'public/sounds/notification.mp3'
import { socket } from '~/apis/socket/socket-connect'
import { useAuth } from '~/contexts/auth'
import { useSockets } from '~/contexts/chatting-context'

import {
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { isNil } from 'lodash'
import { UserInformationResponse } from 'ume-service-openapi'

import { Footer } from '~/components/footer/footer.component'
import { Header } from '~/components/header/header.component'
import { Sidebar } from '~/components/sidebar'

import { getSocket } from '~/utils/constants'
import { trpc } from '~/utils/trpc'

type AppLayoutProps = PropsWithChildren

interface SocketContext {
  socketContext: {
    socketNotificateContext: any[]
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

export const SocketContext = createContext<SocketContext>({
  socketContext: {
    socketNotificateContext: [],
    socketLivestreamContext: [],
  },
  setSocketContext: () => {},
})

export const DrawerContext = createContext<DrawerProps>({
  childrenDrawer: <></>,
  setChildrenDrawer: () => {},
})

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInformationResponse>()
  let accessToken
  const { isAuthenticated } = useAuth()
  const { messages } = useSockets()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const utils = trpc.useContext()

  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken')
  }

  const [childrenDrawer, setChildrenDrawer] = useState<ReactNode>()
  const [socketContext, setSocketContext] = useState<SocketContext['socketContext']>({
    socketNotificateContext: [],
    socketLivestreamContext: [],
  })

  trpc.useQuery(['identity.identityInfo'], {
    onSuccess(data) {
      setUserInfo(data.data)
    },
    onError() {},
    enabled: isNil(userInfo),
  })

  useEffect(() => {
    if (!!accessToken || isAuthenticated) {
      utils.invalidateQueries(['booking.getUserBySlug'])

      const socketInstance = Boolean(userInfo?.id) ? socket(accessToken) : null

      if (socketInstance?.socketInstanceBooking) {
        socketInstance.socketInstanceBooking.on(getSocket().SOCKET_SERVER_EMIT.USER_BOOKING_PROVIDER, (...args) => {
          audioRef.current?.play()
          setSocketContext((prev) => ({ ...prev, socketNotificateContext: args }))
        })
        socketInstance.socketInstanceBooking.on(getSocket().SOCKET_SERVER_EMIT.PROVIDER_HANDLED_BOOKING, (...args) => {
          audioRef.current?.play()
          setSocketContext((prev) => ({ ...prev, socketNotificateContext: args }))
        })
        socketInstance.socketInstanceBooking.on(getSocket().SOCKET_SERVER_EMIT.ADMIN_HANDLE_KYC, (...args) => {
          audioRef.current?.play()
          utils.invalidateQueries('identity.identityInfo')
          setSocketContext((prev) => ({ ...prev, socketNotificateContext: args }))
        })
      }

      return () => {
        if (socketInstance?.socketInstanceBooking) {
          socketInstance.socketInstanceBooking.off(getSocket().SOCKET_SERVER_EMIT.USER_BOOKING_PROVIDER)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, isAuthenticated, userInfo])

  useEffect(() => {
    if (messages && (messages?.length ?? 0) > 0) {
      messages[messages?.length - 1]?.senderId != userInfo?.id &&
        userInfo?.isAllowNotificationMessage &&
        audioRef.current?.play()
    }
  }, [messages, userInfo?.id, userInfo?.isAllowNotificationMessage])

  const socketClientEmitValue = useMemo(
    () => ({ socketContext, setSocketContext, childrenDrawer, setChildrenDrawer }),
    [socketContext, setSocketContext, childrenDrawer, setChildrenDrawer],
  )
  return (
    <SocketContext.Provider value={socketClientEmitValue}>
      <audio ref={audioRef} src={NotiSound} />
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
      <Footer />
    </SocketContext.Provider>
  )
}
