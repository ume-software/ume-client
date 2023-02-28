import { withTRPC } from '@trpc/next'
// include styles from the ui package
import '@ume/ui/styles.css'
import { RootRouterTypes } from '~/api'
import '~/styles/globals.css'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
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
