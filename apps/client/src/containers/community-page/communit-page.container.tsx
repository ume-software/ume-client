import Head from 'next/head'

import CommunityContainer from './community.container'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

const CommunityPage = (props) => {
  return (
    <div>
      <Head>
        <title>UME | Cộng đồng</title>
      </Head>
      <AppLayout {...props}>
        <CommunityContainer />
      </AppLayout>
    </div>
  )
}

export default CommunityPage
