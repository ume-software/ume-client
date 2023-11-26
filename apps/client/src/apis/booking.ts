import { CreateReportUserRequestReasonTypeEnum } from 'ume-service-openapi'
import { z } from 'zod'

import { createRouter } from './configurations'
import {
  createBooking,
  donationForRecipient,
  getAlbumByUserSlug,
  getAllNotice,
  getCanFeedbackProvider,
  getCurrentBookingForProvider,
  getCurrentBookingForUser,
  getFeedbackServiceById,
  getHotProviders,
  getListService,
  getNoticeAmount,
  getPendingBookingForProvider,
  getPendingBookingForUser,
  getPostByUserSlug,
  getProviders,
  getServiceBySlug,
  getUserBySlug,
  postFeedback,
  postReportUser,
  putProviderResponeBooking,
} from './services/booking-service'

export const bookingRouter = createRouter()
  .query('getListService', {
    input: z.optional(
      z.object({
        where: z.optional(z.string()),
      }),
    ),
    resolve: async ({ input, ctx }) => {
      return await getListService(input)
    },
  })
  .query('getProviders', {
    input: z.optional(
      z.object({
        startCost: z.optional(z.number()),
        endCost: z.optional(z.number()),
        serviceId: z.optional(z.string()),
        serviceAttributeValueIds: z.array(z.string()),
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
  .query('getUserBySlug', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      return await getUserBySlug(input)
    },
  })
  .query('getCurrentBookingForProvider', {
    resolve: async ({ ctx }) => {
      return await getCurrentBookingForProvider(ctx)
    },
  })
  .query('getCurrentBookingForUser', {
    resolve: async ({ ctx }) => {
      return await getCurrentBookingForUser(ctx)
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
  .query('getFeedbackServiceById', {
    input: z.string(),
    resolve: async ({ input }) => {
      return await getFeedbackServiceById(input)
    },
  })
  .query('getCanFeedbackProvider', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      return await getCanFeedbackProvider(input, ctx)
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
  .query('getAlbumByUserSlug', {
    input: z.object({ slug: z.string(), page: z.optional(z.string()), limit: z.optional(z.string()) }),
    resolve: async ({ ctx, input }) => {
      return await getAlbumByUserSlug(input, ctx)
    },
  })
  .mutation('donationForRecipient', {
    input: z.object({
      recipientId: z.string(),
      amount: z.number(),
      message: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await donationForRecipient(input, ctx)
    },
  })
  .query('getPostByUserSlug', {
    input: z.object({ userSlug: z.string(), page: z.string() }),
    resolve: async ({ ctx, input }) => {
      return await getPostByUserSlug(input, ctx)
    },
  })
  .mutation('postReportUser', {
    input: z.object({
      slug: z.string(),
      reasonType: z.nativeEnum(CreateReportUserRequestReasonTypeEnum),
      content: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      return await postReportUser(input, ctx)
    },
  })
  .query('getServiceBySlug', {
    input: z.object({ slug: z.string() }),
    resolve: async ({ ctx, input }) => {
      return await getServiceBySlug(input, ctx)
    },
  })
  .query('getPendingBookingForProvider', {
    resolve: async ({ ctx }) => {
      return await getPendingBookingForProvider(ctx)
    },
  })
  .query('getPendingBookingForUser', {
    resolve: async ({ ctx }) => {
      return await getPendingBookingForUser(ctx)
    },
  })
