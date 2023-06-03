import { SocketContext, socket } from '~/api/socket/socket-booking'
import Chat from '~/containers/chat/chat.container'

import { ReactElement, ReactNode, createContext, useContext, useState } from 'react'

import { Header } from '~/components/header/header.component'
import { Sidebar } from '~/components/sidebar'

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
  return (
    <>
      <SocketContext.Provider
        value={socket(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFiNmM0NzUyLTQzYjEtNGJkOC1iNmFmLWUzMGZlYTU0NGVjNyIsImxvZ2luVHlwZSI6IklOQVBQIiwidHlwZSI6IlVTRVIiLCJpYXQiOjE2ODU2OTY0NzgsImV4cCI6MTY5MDg4MDQ3OH0.VXqkSQvTJ6mXPAD5fPuuvcbkrKtXwpqqk6Xhr9Aq7Y4',
        )}
      >
        <div className="flex flex-col">
          <div className="fixed flex flex-col w-full z-10">
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
    </>
  )
}
