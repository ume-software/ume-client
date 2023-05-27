import { withTRPC } from '@trpc/next'
// include styles from the ui package
import '@ume/ui/styles.css'
import { RootRouterTypes } from '~/api'
import '~/styles/globals.css'

import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

const WithTRPCApp = withTRPC<RootRouterTypes>({
  config({ ctx }) {
    const url = '/api/trpc'

    return {
      url,
    }
  },
  ssr: false,
})(MyApp)

export default WithTRPCApp
