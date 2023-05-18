import { TRPCError } from '@trpc/server'
import { getENV } from '~/env'

import { BookingApi, SkillApi } from 'ume-booking-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getListSkill = async () => {
  try {
    const listSkill = await new SkillApi({
      basePath: getENV().baseBookingURL,
      isJsonMime: () => true,
    }).findAndCountAll()

    return {
      data: listSkill.data,
    }
  } catch (error) {
    console.log('error at catch', error)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get applications',
    })
  }
}
