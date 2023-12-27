import dynamic from 'next/dynamic'

import { PageLoading } from '~/components/skeleton-load'

const AccountSettingRender = dynamic(() => import('~/containers/account-setting/account-setting-page.container'), {
  ssr: false,
  loading: () => <PageLoading />,
})

const AccountSetting = (props) => {
  return <AccountSettingRender {...props} />
}
export default AccountSetting
