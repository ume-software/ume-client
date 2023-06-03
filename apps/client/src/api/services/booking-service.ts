import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { BookingApi, BookingProviderRequest, ProviderApi, SkillApi } from 'ume-booking-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getListSkill = async () => {
  try {
    const response = await new SkillApi({
      basePath: getEnv().baseBookingURL,
      isJsonMime: () => true,
    }).findAndCountAll('unlimited', '1', '["$all"]')

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
      basePath: getEnv().baseBookingURL,
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

export const getProviderBySlug = async (providerId: string) => {
  try {
    const respone = await new ProviderApi({
      basePath: getEnv().baseBookingURL,
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

export const createBooking = async (provider: BookingProviderRequest) => {
  try {
    const respone = await new BookingApi({
      basePath: getEnv().baseBookingURL,
      isJsonMime: () => true,
    }).createbooking(provider)
    return {
      data: respone,
    }
  } catch (error) {
    console.log('error at catch', error)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status) || 500,
      message: error.message || 'Fail to get create new booking',
    })
  }
}
