import { TRPCError } from '@trpc/server'
import { getENV } from '~/env'

import { BookingApi, ProviderApi, SkillApi } from 'ume-booking-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getListSkill = async () => {
  try {
    const response = await new SkillApi({
      basePath: getENV().baseBookingURL,
      isJsonMime: () => true,
    }).findAndCountAll()

    return {
      data: response.data,
    }
  } catch (error) {
    console.log('error at catch', error)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list skill',
    })
  }
}

export const getProviders = async () => {
  try {
    const response = await new ProviderApi({
      basePath: getENV().baseBookingURL,
      isJsonMime: () => true,
    }).getListProvider()
    return {
      data: response.data,
    }
  } catch (error) {
    console.log('error at catch', error)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list skill',
    })
  }
}
