import Head from 'next/head'

import Category from './components/category'
import Cover from './components/cover'
import { Promotion } from './components/promotion'

const HomePage = (props) => {
  return (
    <div>
      <Head>
        <title>UME | Trang Chủ</title>
      </Head>

      <div className="flex flex-col mx-16">
        <Cover />
        <Category />
        <Promotion />
      </div>
    </div>
  )
}

export default HomePage
