import { SocketContext, socket, socketTokenContext } from '~/api/socket/socket-booking'

import { ReactNode, createContext, useEffect, useState } from 'react'

import { Header } from '~/components/header/header.component'
import { Sidebar } from '~/components/sidebar'

import { getSocket } from '~/utils/constants'

interface AppLayoutProps {
  children: ReactNode
}
interface DrawerProps {
  childrenDrawer: ReactNode
  setChildrenDrawer: (children: ReactNode) => void
}

export const drawerContext = createContext<DrawerProps>({
  childrenDrawer: <></>,
  setChildrenDrawer: () => {},
})

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [childrenDrawer, setChildrenDrawer] = useState<ReactNode>()
  const [socketToken, setSocketToken] = useState(null)
  const socketInstance = socketToken ? socket(socketToken) : null

  useEffect(() => {
    if (socketInstance) {
      socketInstance.on(getSocket().SOCKET_SERVER_EMIT.USER_BOOKING_PROVIDER, (...args) => {
        console.log(...args)
      })
    }
  }, [socketInstance])

  return (
    <>
      <socketTokenContext.Provider value={{ socketToken, setSocketToken }}>
        <SocketContext.Provider value={socketInstance || null}>
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
      </socketTokenContext.Provider>
    </>
  )
}
