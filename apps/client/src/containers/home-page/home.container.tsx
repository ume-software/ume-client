import Category from './component/category'
import Cover from './component/cover'
import Promotion from './component/promotion'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

import { trpc } from '~/utils/trpc'

const HomePage = (props) => {
  return (
    <AppLayout {...props}>
      <div className="flex flex-col mx-16">
        <Cover />
      </div>
      <div>
        <p className="block mx-20 my-10 text-3xl font-semibold text-white ">Danh mục</p>
      </div>
    </AppLayout>
  )
}

export default HomePage
