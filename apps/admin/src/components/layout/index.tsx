import { setItem } from '~/hooks/localHooks'

import { log } from 'console'
import { useRouter } from 'next/router'

import { Header } from '../header'
import Sidebar from '../sidebar'

import { trpc } from '~/utils/trpc'

interface ILayout {
  children: React.ReactNode
}
const Layout = ({ children }: ILayout) => {
  const response = trpc.useQuery(['identity.adminInfo'], {
    onSuccess(data) {
      setItem('user', data.data)
    },
    onError(error) {
      console.log('get-info admin', error)
    },
  })

  const router = useRouter()
  if (router.pathname == '/signin') {
    return <>{children}</>
  }
  return (
    <>
      <div>
        <Header />
        <Sidebar />
      </div>
      <div className="mt-16 ml-[18%] px-20 py-5 h-full bg-black text-white">{children}</div>
    </>
  )
}
export default Layout
