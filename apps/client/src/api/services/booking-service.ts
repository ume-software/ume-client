import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse, serialize } from 'cookie'
import { BookingApi, BookingProviderRequest, ProviderApi, SkillApi } from 'ume-booking-service-openapi'

import { socket } from '../socket'

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

export const createBooking = async (provider: BookingProviderRequest, ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie)
    const respone = await new BookingApi({
      basePath: getEnv().baseBookingURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).createbooking(provider)
    return {
      data: respone,
      success: true,
      message: 'Booking success!',
    }
  } catch (error) {
    console.log('error at catch', error)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to create new booking',
    })
  }
}
