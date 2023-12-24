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
    const { accessToken, refreshToken } = response.data
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
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Authentication failed',
    })
  }
}
