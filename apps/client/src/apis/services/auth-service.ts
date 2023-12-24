import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { serialize } from 'cookie'
import { AuthApi } from 'ume-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const signinService = async ({ type, token }, ctx) => {
  try {
    const response = await new AuthApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).loginSNS({
      loginType: type,
      token: token,
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
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Authentication failed',
    })
  }
}
