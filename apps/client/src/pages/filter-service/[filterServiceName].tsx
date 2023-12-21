import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { PageLoading } from '~/components/skeleton-load'

const FilterService = dynamic(() => import('~/containers/filter-page/filter-page.container'), {
  ssr: false,
  loading: () => <PageLoading />,
})

const FilterServicePage = (props) => {
  const router = useRouter()
  const serviceName = router.query.filterServiceName

  return <FilterService serviceName={serviceName} />
}
export default FilterServicePage
