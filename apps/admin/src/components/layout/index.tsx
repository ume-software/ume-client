import { useRouter } from 'next/router'

import { Header } from '../header'
import Sidebar from '../sidebar'

interface ILayout {
  children: React.ReactNode
}
const Layout = ({ children }: ILayout) => {
  const router = useRouter()
  if (router.pathname == '/signin') {
    return <>{children}</>
  }
  return (
    <>
      <div className="max-w-full max-h-full">
        <Header />
      </div>
      <div>
        <Sidebar />
        <div className="mt-16 pl-[23%] w-full pr-[2%] py-5 min-h-screen bg-[#15151b] text-white">{children}</div>
      </div>
    </>
  )
}

export default Layout
