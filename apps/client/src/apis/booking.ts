import { BookingHandleRequest, BookingHandleRequestStatusEnum } from 'ume-service-openapi'
import { optional, z } from 'zod'

import { createRouter } from './configurations'
import {
  createBooking,
  getAblumByProviderSlug,
  getAllNotice,
  getCurrentBookingForProvider,
  getFeedbackSkillById,
  getHotProviders,
  getListSkill,
  getNoticeAmount,
  getProviderBySlug,
  getProviders,
  postFeedback,
  putProviderResponeBooking,
} from './services/booking-service'

export const bookingRouter = createRouter()
  .query('getListSkill', {
    resolve: async ({ ctx }) => {
      return await getListSkill()
    },
  })
  .query('getProviders', {
    input: z.optional(
      z.object({
        startCost: z.optional(z.number()),
        endCost: z.optional(z.number()),
        skillId: z.optional(z.string()),
        name: z.optional(z.string()),
        gender: z.optional(z.string()),
        status: z.optional(z.string()),
        limit: z.optional(z.string()),
        page: z.optional(z.string()),
        order: z.optional(z.string()),
      }),
    ),
    resolve: async ({ ctx, input }) => {
      return await getProviders(input)
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
  .query('getCurrentBookingForProvider', {
    resolve: async ({ ctx }) => {
      return await getCurrentBookingForProvider(ctx)
    },
  })
  .mutation('createBooking', {
    input: z.object({
      providerServiceId: z.string(),
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
    resolve: async ({ input }) => {
      return await getFeedbackSkillById(input)
    },
  })
  .mutation('postFeedback', {
    input: z.object({
      id: z.string(),
      feedback: z.optional(z.object({ content: z.optional(z.string()), amountStar: z.optional(z.number()) })),
    }),
    resolve: async ({ ctx, input }) => {
      return await postFeedback(input, ctx)
    },
  })
  .query('getNoticeAmount', {
    resolve: async ({ ctx }) => {
      return await getNoticeAmount(ctx)
    },
  })
  .query('getAllNotice', {
    input: z.object({ page: z.string(), limit: z.string() }),
    resolve: async ({ ctx, input }) => {
      return await getAllNotice(input, ctx)
    },
  })
  .query('getAblumByProviderSlug', {
    input: z.object({ slug: z.string(), page: z.optional(z.string()), limit: z.optional(z.string()) }),
    resolve: async ({ ctx, input }) => {
      return await getAblumByProviderSlug(input, ctx)
    },
  })
