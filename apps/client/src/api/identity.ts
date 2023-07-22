import { z } from 'zod'

import { createRouter } from './configurations'
import { getAccountBalance, getIdentityInfo, getUserBySlug, requestRecharge } from './services/identity-service'

export const identityRouter = createRouter()
  .query('identityInfo', {
    resolve: async ({ ctx }) => {
      return await getIdentityInfo(ctx)
    },
  })
  .query('account-balance', {
    resolve: async ({ ctx }) => {
      return await getAccountBalance(ctx)
    },
  })
  .mutation('request-recharge', {
    input: z.object({
      platform: z.string(),
      total: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      return await requestRecharge(input, ctx)
    },
  })
  .query('getUserBySlug', {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      return await getUserBySlug(input, ctx)
    },
  })
