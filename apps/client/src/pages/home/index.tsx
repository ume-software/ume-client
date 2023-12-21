import dynamic from 'next/dynamic'

import { PageLoading } from '~/components/skeleton-load'

const HomeRender = dynamic(() => import('~/containers/home-page/home-page.container'), {
  ssr: false,
  loading: () => <PageLoading />,
})

const HomePage = (props) => {
  return <HomeRender {...props} />
}
export default HomePage
