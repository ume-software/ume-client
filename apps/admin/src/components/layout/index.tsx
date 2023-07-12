import { setItem } from '~/hooks/localHooks'

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

  return (
    <>
      <div>
        <Header />
        <Sidebar />
      </div>
      <div className="mt-12 ml-20">{children}</div>
    </>
  )
}
export default Layout
