import { z } from 'zod'

import { createRouter } from './configurations'
import { banUser, getUserCoinHistories, getUserList, getUserTotalCoin, unBanUser } from './services/user-service'

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
