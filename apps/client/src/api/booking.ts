import { BookingHandleRequest, BookingHandleRequestStatusEnum } from 'ume-booking-service-openapi'
import { z } from 'zod'

import { createRouter } from './configurations'
import {
  createBooking,
  getBookingProvider,
  getFeedbackSkillById,
  getHotProviders,
  getListSkill,
  getProviderBySlug,
  getProviders,
  putProviderResponeBooking,
} from './services/booking-service'

export const bookingRouter = createRouter()
  .query('getListSkill', {
    resolve: async ({ ctx }) => {
      return await getListSkill()
    },
  })
  .query('getProviders', {
    resolve: async ({ ctx }) => {
      return await getProviders()
    },
  })
  .query('getHotProviders', {
    resolve: async ({ ctx }) => {
      return await getHotProviders()
    },
  })
  .query('getProviderBySlug', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      return await getProviderBySlug(input)
    },
  })
  .query('getBookingProvider', {
    resolve: async ({ ctx }) => {
      return await getBookingProvider(ctx)
    },
  })
  .mutation('createBooking', {
    input: z.object({
      providerSkillId: z.string(),
      bookingPeriod: z.number(),
      voucherIds: z.array(z.string()).optional(),
    }),
    resolve: async ({ ctx, input }) => {
      return await createBooking(input, ctx)
    },
  })
  .mutation('putProviderResponeBooking', {
    input: z.object({
      bookingHistoryId: z.string(),
      status: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      return await putProviderResponeBooking(input, ctx)
    },
  })
  .query('getFeedbackSkillById', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      return await getFeedbackSkillById(input)
    },
  })
