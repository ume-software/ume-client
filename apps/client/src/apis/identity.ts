import { z } from 'zod'

import { createRouter } from './configurations'
import {
  getAccountBalance,
  getIdentityInfo,
  getUserBySlug,
  requestRecharge,
  updateUserProfile,
} from './services/identity-service'

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
  .mutation('updateUserProfile', {
    input: z.object({
      name: z.string(),
      slug: z.string(),
      gender: z.string(),
      dob: z.string(),
      avatarUrl: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      return await updateUserProfile(input, ctx)
    },
  })
