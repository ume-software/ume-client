import Head from 'next/head'

import FilterContainer from './components/filter.container'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

const FilterPage = (props) => {
  return (
    <>
      <Head>
        <title>UME | {props?.skillName}</title>
      </Head>
      <AppLayout {...props}>
        <FilterContainer skillName={props?.skillName} />
      </AppLayout>
    </>
  )
}
export default FilterPage
