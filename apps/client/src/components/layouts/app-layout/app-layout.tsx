import { PhoneOff, Videocamera } from '@icon-park/react'
import NotiSound from 'public/sounds/notification.mp3'
import { socket } from '~/apis/socket/socket-connect'
import { useAuth } from '~/contexts/auth'
import { useChattingSockets } from '~/contexts/chatting-context'

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
import Link from 'next/link'
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
    socketVideoCallContext: any[]
  }
  setSocketContext: Dispatch<
    SetStateAction<{ socketNotificateContext: any[]; socketChattingContext: any[]; socketVideoCallContext: any[] }>
  >
}
interface DrawerProps {
  childrenDrawer: ReactNode
  setChildrenDrawer: (children: ReactNode) => void
}

export const SocketContext = createContext<SocketContext>({
  socketContext: {
    socketNotificateContext: [],
    socketVideoCallContext: [],
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
  const { socket: socketChattingEmit, messages, newCall, setEndCallType } = useChattingSockets()
  const [isPressCalling, setIsPressCalling] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const utils = trpc.useContext()

  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken')
  }

  const [childrenDrawer, setChildrenDrawer] = useState<ReactNode>()
  const [socketContext, setSocketContext] = useState<SocketContext['socketContext']>({
    socketNotificateContext: [],
    socketVideoCallContext: [],
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

  useEffect(() => {
    setIsPressCalling(false)
  }, [newCall])

  const handleAcceptCall = (newCall) => {
    setIsPressCalling(true)
    window.open(
      `${window.location.origin}/video-call?channelId=${encodeURIComponent(
        newCall?.channelName,
      )}&uid=${encodeURIComponent(newCall?.uid)}&tk=${encodeURIComponent(newCall?.rtcToken)}`,
      'winname',
      'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=1200,height=850',
    )
  }

  const handleCancelCall = () => {
    socketChattingEmit.emit(getSocket().SOCKER_CHATTING_SERVER_ON.CANCEL_CALL_CHANNEL, {
      channelId: newCall?.channelName,
    })
    setEndCallType(undefined)
    setIsPressCalling(true)
  }

  return (
    <SocketContext.Provider value={socketClientEmitValue}>
      {newCall?.rtcToken && !isPressCalling && (
        <div className="fixed top-30 left-30 w-full min-h-screen bg-black bg-opacity-50 z-50 flex flex-col justify-center gap-5">
          <p className="text-center text-white text-3xl font-bold">{newCall?.userInformation?.name} đang gọi đến...</p>
          <div className="flex justify-center items-center gap-5">
            <button
              type="button"
              className="bg-green-500 p-5 rounded-full cursor-pointer"
              onClick={() => handleAcceptCall(newCall)}
            >
              <Videocamera theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />
            </button>
            <button type="button" className="bg-red-500 p-5 rounded-full cursor-pointer" onClick={handleCancelCall}>
              <PhoneOff theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />
            </button>
          </div>
        </div>
      )}
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
