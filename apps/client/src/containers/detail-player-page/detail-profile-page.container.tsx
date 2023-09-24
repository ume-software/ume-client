import Head from 'next/head'

import DetailPlayerContainer from './detail-profile.container'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

const DetailProfilePage = (props) => {
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
export default DetailProfilePage
