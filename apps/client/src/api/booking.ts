import { z } from 'zod'

import { createRouter } from './configurations'
import { createBooking, getListSkill, getProviderBySlug, getProviders } from './services/booking-service'

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
  .query('getProviderBySlug', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      return await getProviderBySlug(input)
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
