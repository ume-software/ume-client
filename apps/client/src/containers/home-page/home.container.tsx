

import { AppLayout } from '~/components/layouts/app-layout/app-layout'
import Cover from './cover'

const HomePage = (props) => {
  return (
    <AppLayout {...props}>
      <div className="flex min-h-screen grow">
        <Cover />
      </div>
    </AppLayout>
  )
}

export default HomePage
