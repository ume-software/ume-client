import { AppLayout } from "~/components/layouts/app-layout/app-layout"
import HeaderInformation from './components/header-information';

const DetailUser = (props) => {
  return (<>
    <AppLayout {...props}>
      <HeaderInformation />
    </AppLayout></>
  )
}
export default DetailUser
