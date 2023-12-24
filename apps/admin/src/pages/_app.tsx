import { withTRPC } from '@trpc/next'
import '@ume/ui/styles.css'
import { RootRouterTypes } from '~/api'
import { AuthProvider } from '~/contexts/auth'
import '~/styles/globals.css'

import type { AppProps } from 'next/app'

import Layout from '~/components/layout'

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

const TRPCApp = withTRPC<RootRouterTypes>({
  config({}) {
    const url = '/api/trpc'

    return {
      url,
    }
  },
  ssr: false,
})(App)

export default TRPCApp
