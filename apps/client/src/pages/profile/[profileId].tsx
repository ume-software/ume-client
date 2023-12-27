import dynamic from 'next/dynamic'

import { PageLoading } from '~/components/skeleton-load'

const DetailPlayerRender = dynamic(() => import('~/containers/detail-profile-page/detail-profile-page.container'), {
  ssr: false,
  loading: () => <PageLoading />,
})

const DetailPlayerPage = (props) => {
  return <DetailPlayerRender />
}
export default DetailPlayerPage
