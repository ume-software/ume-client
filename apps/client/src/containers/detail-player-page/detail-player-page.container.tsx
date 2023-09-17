import Head from 'next/head'

import DetailPlayerContainer from './detail-player.container'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

const DetailPlayerPage = (props) => {
  return (
    <>
      <Head>
        <title>UME | Provider</title>
      </Head>
      <AppLayout {...props}>
        <DetailPlayerContainer />
      </AppLayout>
    </>
  )
}
export default DetailPlayerPage
