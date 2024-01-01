import dynamic from 'next/dynamic'

import { PageLoading } from '~/components/skeleton-load'

const TermsOfServiceRender = dynamic(() => import('~/containers/terms-of-service/terms-of-service.container'), {
  ssr: false,
  loading: () => <PageLoading />,
})

const TermsOfServicePage = (props) => {
  return <TermsOfServiceRender {...props} />
}
export default TermsOfServicePage
