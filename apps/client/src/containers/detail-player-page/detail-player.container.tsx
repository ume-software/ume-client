import PlayerInformation from './components/header-information'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

const DetailUser = (props) => {
  return (
    <>
      <AppLayout {...props}>
        <PlayerInformation />
      </AppLayout>
    </>
  )
}
export default DetailUser
