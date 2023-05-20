import DetailPlayer from './components/detail-player'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

const DetailUser = (props) => {
  return (
    <>
      <AppLayout {...props}>
        <DetailPlayer />
      </AppLayout>
    </>
  )
}
export default DetailUser
