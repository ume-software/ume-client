import { z } from 'zod'

import { createRouter } from './configurations'
import { kcyAction } from './services/provider-service'
import {
  BanProvider,
  UnBanProvider,
  getListKYC,
  getProviderBookingHistory,
  getProviderBookingStatistics,
  getProviderDetail,
  getProviderList,
  getProviderSkill,
  getProviderTotalCoin,
} from './services/provider-service'

export const providerRouter = createRouter()
  .query('getProviderList', {
    input: z.object({
      limit: z.optional(z.string()),
      page: z.optional(z.string()),
      select: z.optional(z.string()),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getProviderList(ctx, input)
    },
  })
  .query('getProviderDetail', {
    input: z.object({
      slug: z.string(),
      limit: z.optional(z.string()),
      page: z.optional(z.string()),
      select: z.optional(z.string()),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getProviderDetail(ctx, input)
    },
  })
  .query('getProviderSkill', {
    input: z.object({
      slug: z.string(),
      limit: z.optional(z.string()),
      page: z.optional(z.string()),
      select: z.optional(z.string()),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getProviderSkill(ctx, input)
    },
  })
  .query('getProviderBookingHistory', {
    input: z.object({
      slug: z.string(),
      limit: z.optional(z.string()),
      page: z.optional(z.string()),
      select: z.optional(z.string()),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getProviderBookingHistory(ctx, input)
    },
  })
  .query('getProviderBookingStatistics', {
    input: z.object({
      slug: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      return await getProviderBookingStatistics(ctx, input)
    },
  })
  .query('getProviderTotalCoin', {
    input: z.object({
      slug: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      return await getProviderTotalCoin(ctx, input)
    },
  })
  .mutation('BanProvider', {
    input: z.object({
      slug: z.string(),
      adminHandleBanProviderRequest: z.optional(z.object({ content: z.optional(z.string()) })),
    }),
    resolve: async ({ input, ctx }) => {
      return await BanProvider(input, ctx)
    },
  })
  .mutation('UnBanProvider', {
    input: z.object({
      slug: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      return await UnBanProvider(input, ctx)
    },
  })
  .query('getListRequestKYC', {
    input: z.object({
      limit: z.optional(z.string()),
      page: z.optional(z.string()),
      select: z.optional(z.string()),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getListKYC(ctx, input)
    },
  })
  .mutation('actionKYC', {
    input: z.object({
      id: z.string(),
      action: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      return await kcyAction(ctx, { id: input.id, action: input.action })
    },
  })
