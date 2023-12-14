import Head from 'next/head'

import CommunityContainer from './community.container'

const CommunityPage = (props) => {
  return (
    <div>
      <Head>
        <title>UME | Cộng đồng</title>
      </Head>
      <div>
        <CommunityContainer />
      </div>
    </div>
  )
}

export default CommunityPage
