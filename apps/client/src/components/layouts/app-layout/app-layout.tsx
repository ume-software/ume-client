import { ReactNode } from 'react'

import { Header } from '~/components/header/header.component'

interface AppLayoutProps {
  children: ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <>
      <div className='flex flex-col flex-1 w-full min-h-screen pl-16 sm:ml-2'>
        <Header />
        <div className="flex-1 px-8 pt-24 pb-8">{children}</div>
      </div>
    </>
  )
}
