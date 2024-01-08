import NotiSound from 'public/sounds/notification.mp3'
import { useChattingSockets } from '~/contexts/chatting-context'
import { useUmeServiceSockets } from '~/contexts/ume-service-context'

import { PropsWithChildren, ReactNode, createContext, useEffect, useMemo, useRef, useState } from 'react'

import { isNil } from 'lodash'
import { UserInformationResponse } from 'ume-service-openapi'

import { Footer } from '~/components/footer/footer.component'
import { Header } from '~/components/header/header.component'
import { Sidebar } from '~/components/sidebar'

import { trpc } from '~/utils/trpc'

type AppLayoutProps = PropsWithChildren

interface DrawerProps {
  childrenDrawer: ReactNode
  setChildrenDrawer: (children: ReactNode) => void
}

export const DrawerContext = createContext<DrawerProps>({
  childrenDrawer: <></>,
  setChildrenDrawer: () => {},
})

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInformationResponse>()
  const { callingFormOtherUser } = useUmeServiceSockets()
  const { messages } = useChattingSockets()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [childrenDrawer, setChildrenDrawer] = useState<ReactNode>()

  trpc.useQuery(['identity.identityInfo'], {
    onSuccess(data) {
      setUserInfo(data.data)
    },
    onError() {},
    enabled: isNil(userInfo),
  })
  console.log('callingFormOtherUser', callingFormOtherUser)
  useEffect(() => {
    console.log(callingFormOtherUser)

    if (callingFormOtherUser && (callingFormOtherUser?.length ?? 0) > 0) {
      callingFormOtherUser[0]?.senderId != userInfo?.id &&
        userInfo?.isAllowNotificationMessage &&
        audioRef.current?.play()
    }
  }, [callingFormOtherUser, userInfo?.id, userInfo?.isAllowNotificationMessage])

  useEffect(() => {
    if (messages && (messages?.length ?? 0) > 0) {
      messages[messages?.length - 1]?.senderId != userInfo?.id &&
        userInfo?.isAllowNotificationMessage &&
        audioRef.current?.play()
    }
  }, [messages, userInfo?.id, userInfo?.isAllowNotificationMessage])

  const drawerContext = useMemo(() => ({ childrenDrawer, setChildrenDrawer }), [childrenDrawer, setChildrenDrawer])
  return (
    <>
      <audio ref={audioRef} src={NotiSound} />
      <div className="flex flex-col">
        <div className="fixed z-10 flex flex-col w-full ">
          <Header />
        </div>
        <DrawerContext.Provider value={drawerContext}>
          <div className="pb-8 bg-umeBackground pt-[90px] pr-[60px] pl-[10px]">{children}</div>
          <div className="fixed h-full bg-umeHeader top-[65px] right-0">
            <Sidebar />
          </div>
        </DrawerContext.Provider>
      </div>
      <Footer />
    </>
  )
}
