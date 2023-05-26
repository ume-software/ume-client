import Category from './component/category'
import Cover from './component/cover'
import Promotion from './component/promotion'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

const HomePage = (props) => {
  const ListCardDumbData = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
  ]
  return (
    <AppLayout {...props}>
      <div className="flex mx-16 flex-col">
        <Cover />
        <Category />
        <Promotion datas={ListCardDumbData} />
      </div>
    </AppLayout>
  )
}

export default HomePage
