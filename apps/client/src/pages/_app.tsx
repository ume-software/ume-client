import { GoogleOAuthProvider } from '@react-oauth/google'
import { withTRPC } from '@trpc/next'
// include styles from the ui package
import '@ume/ui/styles.css'
import { RootRouterTypes } from '~/apis'
import '~/styles/globals.css'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId="539493137887-3d21r0n63uuh66bmd6cog1fkih85h93m.apps.googleusercontent.com">
      <Component {...pageProps} />
    </GoogleOAuthProvider>
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
