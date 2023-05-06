import Category from './component/category'
import Cover from './component/cover'
import Promotion from './component/promotion'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

const HomePage = (props) => {
  const ListCardDumbData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  return (
    <AppLayout {...props}>
      <div className="flex mx-16 flex-col">
        <Cover />
        <Category />
        <Promotion listCard={ListCardDumbData} />
      </div>
    </AppLayout>
  )
}

export default HomePage
