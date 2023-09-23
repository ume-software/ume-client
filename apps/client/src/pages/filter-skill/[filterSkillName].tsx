import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const FilterService = dynamic(() => import('~/containers/filter-page/filter-page.container'), {
  ssr: false,
})

const FilterServicePage = (props) => {
  const router = useRouter()
  const serviceName = router.query.filterServiceName

  return <FilterService serviceName={serviceName} />
}
export default FilterServicePage
