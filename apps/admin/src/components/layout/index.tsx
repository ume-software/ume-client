import { setItem } from '~/hooks/localHooks'

import { useRouter } from 'next/router'

import { Header } from '../header'
import Sidebar from '../sidebar'

import { trpc } from '~/utils/trpc'

interface ILayout {
  children: React.ReactNode
}
const Layout = ({ children }: ILayout) => {
  // const response = trpc.useQuery(['identity.adminInfo'], {
  //   onSuccess(data) {
  //     setItem('user', data.data)
  //   },
  //   onError(error) {
  //     console.log('get-info admin', error)
  //   },
  // })

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
        <div className="mt-16 pl-[25%] w-full pr-[3%] py-5 min-h-screen bg-[#15151b] text-white">{children}</div>
      </div>
    </>
  )
}
export default Layout
