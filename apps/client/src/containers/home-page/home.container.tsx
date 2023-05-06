

import { AppLayout } from '~/components/layouts/app-layout/app-layout'
import Category from './component/category'
import Cover from './component/cover'

const HomePage = (props) => {
  return (
    <AppLayout {...props}>
      <div className="flex flex-1">
        <Cover />
      </div>
      <div>
        <p className='text-white mx-20 my-10 block font-semibold text-3xl '>
          Danh mục
        </p>
      </div>

    </AppLayout>
  )
}

export default HomePage
