import Head from 'next/head'

import FilterContainer from './components/filter.container'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

const FilterPage = (props) => {
  return (
    <>
      <Head>
        <title>UME | {props?.serviceName}</title>
      </Head>
      <AppLayout {...props}>
        <FilterContainer serviceName={props?.serviceName} />
      </AppLayout>
    </>
  )
}
export default FilterPage
