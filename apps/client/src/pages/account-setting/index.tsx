import dynamic from 'next/dynamic'

const AccountSettingRender = dynamic(() => import('~/containers/account-setting/account-setting-page.container'), {
  ssr: false,
})

const AccountSetting = (props) => {
  return <AccountSettingRender {...props} />
}
export default AccountSetting
