import HeaderInformation from './components/header-information'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

const DetailUser = (props) => {
  return (
    <>
      <AppLayout {...props}>
        <HeaderInformation />
      </AppLayout>
    </>
  )
}
export default DetailUser
