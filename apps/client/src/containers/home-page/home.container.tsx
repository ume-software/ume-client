import Category from './component/category'
import Cover from './component/cover'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

const HomePage = (props) => {
  return (
    <AppLayout {...props}>
      <div className="flex mx-16 flex-col">
        <Cover />
        <Category />
      </div>
    </AppLayout>
  )
}

export default HomePage
