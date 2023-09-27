import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { serialize } from 'cookie'
import { ProviderApi } from 'ume-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getProviderService = async (query?: {
  startCost?: number
  endCost?: number
  serviceId?: string
  name?: string
  gender?: string
  limit?: string
  page?: string
  order?: string
}) => {
  try {
    const response = await new ProviderApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).getListProvider(
      undefined,
      undefined,
      undefined,
      query?.name,
      query?.gender as 'MALE' | 'FEMALE' | 'OTHER' | 'PRIVATE',
      query?.limit as 'ACTIVATED' | 'UN_ACTIVATED' | 'STOPPED_ACCEPTING_BOOKING' | 'BUSY',
      query?.page,
    )
    return {
      data: response.data,
    }
  } catch (error) {
    console.log('error at catch', error)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list provider',
    })
  }
}
