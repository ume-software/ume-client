import { z } from 'zod'

import { createRouter } from './configurations'
import {
  banUser,
  getUserCoinHistories,
  getUserList,
  getUserTotalCoin,
  statisticNewMember,
  statisticTotalProvider,
  statisticTotalUser,
  unBanUser,
} from './services/user-service'

import { StatisticNewUserType, UnitQueryTime } from '~/utils/constant'

export const userRouter = createRouter()
  .query('getUserList', {
    input: z.object({ page: z.string(), where: z.optional(z.string()), order: z.optional(z.string()) }),
    resolve: async ({ ctx, input }) => {
      return await getUserList(ctx, input)
    },
  })
  .query('getUserCoinHistories', {
    input: z.object({
      slug: z.string(),
      page: z.string(),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getUserCoinHistories(ctx, input)
    },
  })
  .query('getUserTotalCoin', {
    input: z.object({
      slug: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      return await getUserTotalCoin(ctx, input)
    },
  })
  .mutation('banUser', {
    input: z.object({
      slug: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      return await banUser(ctx, input)
    },
  })
  .mutation('unBanUser', {
    input: z.object({
      slug: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      return await unBanUser(ctx, input)
    },
  })
  .query('statisticNewMember', {
    input: z.object({
      time: z.number(),
      unit: z.enum([UnitQueryTime.MONTH, UnitQueryTime.YEAR]),
      type: z.enum([StatisticNewUserType.NEW_USER, StatisticNewUserType.NEW_PROVIDER]),
    }),
    resolve: async ({ ctx, input }) => {
      return await statisticNewMember(ctx, input.type, { time: input.time, unit: input.unit })
    },
  })
  .query('statisticTotalUser', {
    resolve: async ({ ctx }) => {
      return await statisticTotalUser(ctx)
    },
  })
  .query('statisticTotalProvider', {
    resolve: async ({ ctx }) => {
      return await statisticTotalProvider(ctx)
    },
  })
  .query('statisticNewUser', {
    input: z.object({
      time: z.number(),
      unit: z.enum([UnitQueryTime.MONTH, UnitQueryTime.YEAR]),
      type: z.enum([StatisticNewUserType.NEW_USER, StatisticNewUserType.NEW_PROVIDER]),
    }),
    resolve: async ({ ctx, input }) => {
      return await statisticNewMember(ctx, input.type, { time: input.time, unit: input.unit })
    },
  })
