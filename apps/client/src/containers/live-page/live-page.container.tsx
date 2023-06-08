import featureUpdate from 'public/feature-update.png'

import Head from 'next/head'
import Image from 'next/legacy/image'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

const LivePage = (props) => {
  return (
    <div>
      <Head>
        <title>UME | Phát Trực Tiệp</title>
      </Head>
      <AppLayout {...props}>
        <div className="flex flex-col items-center justify-center w-full h-screen">
          <Image src={featureUpdate} alt="featureUpdate" objectFit="cover" />
          <div className="text-4xl font-semibold text-white ">This feature incoming soon.</div>
        </div>
      </AppLayout>
    </div>
  )
}

export default LivePage
