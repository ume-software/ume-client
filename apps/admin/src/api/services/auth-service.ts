import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { AuthApi } from 'ume-identity-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const signinService = async ({ username, password }) => {
  try {
    const response = await new AuthApi({
      basePath: getEnv().baseIdentityURL,
      isJsonMime: () => true,
    }).adminLogin({
      username: username,
      password: password,
    })

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
