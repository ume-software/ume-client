import dynamic from 'next/dynamic'

import { PageLoading } from '~/components/skeleton-load'

const CommunityRender = dynamic(() => import('~/containers/community-page/community-page.container'), {
  ssr: false,
  loading: () => <PageLoading />,
})

const CommunityPage = (props) => {
  return <CommunityRender {...props} />
}
export default CommunityPage
