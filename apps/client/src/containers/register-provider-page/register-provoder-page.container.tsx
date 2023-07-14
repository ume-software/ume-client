import featureUpdate from 'public/feature-update.png'

import Head from 'next/head'
import Image from 'next/legacy/image'

import FormRegisterProvider from './components/form-register-provider'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

const RegisterProviderPage = (props) => {
  return (
    <div>
      <Head>
        <title>UME | Become A Ume</title>
      </Head>
      <AppLayout {...props}>
        <FormRegisterProvider />
      </AppLayout>
    </div>
  )
}

export default RegisterProviderPage
