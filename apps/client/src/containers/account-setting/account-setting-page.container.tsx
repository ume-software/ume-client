import Head from 'next/head'

import AccountSettingContainer from './account-setting.container'

const AccountSettingPage = (props) => {
  return (
    <div>
      <Head>
        <title>UME | Cài đặt</title>
      </Head>
      <div>
        <AccountSettingContainer />
      </div>
    </div>
  )
}

export default AccountSettingPage
