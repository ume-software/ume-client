import { TRPCError } from '@trpc/server'
import { getENV } from '~/env'

import { BookingApi, ProviderApi, SkillApi } from 'ume-booking-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getListSkill = async () => {
  try {
    const response = await new SkillApi({
      basePath: getENV().baseBookingURL,
      isJsonMime: () => true,
    }).findAndCountAll('en', '["$all"]')

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
    }).getListProvider('en', '[$all]')
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

export const getProviderBySlug = async (providerId: string) => {
  try {
    const respone = await new ProviderApi({
      basePath: getENV().baseBookingURL,
      isJsonMime: () => true,
    }).getProviderBySlug(providerId)
    return {
      data: respone.data,
    }
  } catch (error) {
    console.log('error at catch', error)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status) || 500,
      message: error.message || 'Fail to get list skill',
    })
  }
}
