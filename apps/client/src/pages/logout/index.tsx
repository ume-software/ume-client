import { LogoutPage } from '~/containers/logout-page'

import { serialize } from 'cookie'

export async function getServerSideProps(context) {
  try {
    context.res.setHeader('Set-Cookie', [
      serialize('accessToken', '', {
        maxAge: 0,
        path: '/',
      }),
      serialize('refreshToken', '', {
        path: '/',
        maxAge: 0,
      }),
    ])

    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  } catch (error) {}
}

export default LogoutPage
