import Head from 'next/head'

import FAQContainer from './faq.container'

const AccountSettingPage = (props) => {
  return (
    <div>
      <Head>
        <title>UME | FAQ</title>
      </Head>
      <div>
        <FAQContainer />
      </div>
    </div>
  )
}

export default AccountSettingPage
