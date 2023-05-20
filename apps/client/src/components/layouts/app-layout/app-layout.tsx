import { ReactNode, UIEvent } from 'react'

import Sidebar from '../../sidebar/sidebar.component'

import { Header } from '~/components/header/header.component'

interface AppLayoutProps {
  children: ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="fixed flex flex-col w-full z-10">
          <Header />
        </div>
        <div className="pb-8 bg-umeBackground pt-[90px] pr-[80px]">{children}</div>
        <div className="fixed h-full bg-umeHeader top-[65px] right-0">
          <Sidebar />
        </div>
      </div>
    </>
  )
}
