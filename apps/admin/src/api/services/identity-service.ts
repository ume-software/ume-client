import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse, serialize } from 'cookie'
import { AuthApi } from 'ume-identity-service-openapi'
import { BuyCoinRequestApi, CoinApi } from 'ume-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getIdentityInfo = async (ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AuthApi({
      basePath: getEnv().baseIdentityURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getAdminInfo()

    return {
      data: response.data,
      success: true,
      message: 'Success',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Authentication failed',
    })
  }
}
