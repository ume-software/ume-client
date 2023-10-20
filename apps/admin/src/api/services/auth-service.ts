import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'
import { setItem } from '~/hooks/localHooks'

import { serialize } from 'cookie'
import { AdminAuthApi } from 'ume-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const signinService = async ({ username, password }, ctx) => {
  try {
    const response = await new AdminAuthApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).adminLogin({
      username: username,
      password: password,
    })
    const { admin, accessToken, refreshToken } = response.data
    // try {
    //   if (typeof window !== 'undefined') {
    //     window.localStorage.setItem('user', JSON.stringify(admin))
    //   }
    // } catch (localStorageError) {
    //   console.error('Error storing data in localStorage:', localStorageError)
    // }
    ctx.res.setHeader('Set-Cookie', [
      serialize('accessToken', accessToken ?? '', {
        path: '/',
      }),
      serialize('refreshToken', refreshToken ?? '', {
        path: '/',
      }),
    ])

    return {
      data: response.data,
      success: true,
      message: 'Success',
    }
  } catch (error) {
    console.log(error)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Authentication failed',
    })
  }
}
