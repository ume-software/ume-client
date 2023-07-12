import { withTRPC } from '@trpc/next'
import '@ume/ui/styles.css'
import { RootRouterTypes } from '~/api'
import '~/styles/globals.css'

import type { AppProps } from 'next/app'

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
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
