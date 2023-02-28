import { ReactNode } from 'react'

import { Header } from '~/components/header/header.component'

interface AppLayoutProps {
  children: ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="flex-1 px-8 pt-24 pb-8">{children}</div>
    </div>
  )
}
