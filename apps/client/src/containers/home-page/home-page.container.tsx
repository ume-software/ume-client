import Head from 'next/head'

import Category from './components/category'
import Cover from './components/cover'
import { Promotion } from './components/promotion'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

const HomePage = (props) => {
  return (
    <div>
      <Head>
        <title>UME | Trang Chủ</title>
      </Head>
      <AppLayout {...props}>
        <div className="flex flex-col mx-16">
          <Cover />
          <Category />
          <Promotion />
        </div>
      </AppLayout>
    </div>
  )
}

export default HomePage
