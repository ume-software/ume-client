import { withTRPC } from '@trpc/next'
import '@ume/ui/styles.css'
import { RootRouterTypes } from '~/api'
import '~/styles/globals.css'

import type { AppProps } from 'next/app'

import Layout from '~/components/layout'

function App({ Component, pageProps }: AppProps) {
  // if ([`/signin`].includes(pageProps)) return <Component {...pageProps} />
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

const TRPCApp = withTRPC<RootRouterTypes>({
  config({ ctx }) {
    const url = '/api/trpc'

    return {
      url,
    }
  },
  ssr: false,
})(App)

export default TRPCApp
