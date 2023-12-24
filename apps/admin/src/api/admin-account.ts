import { z } from 'zod'

import { createRouter } from './configurations'
import {
  createAdminAccount,
  getAdminAccountDetails,
  getAdminAccountList,
  updateAdminAccount,
} from './services/admin-account-service'

export const adminRouter = createRouter()
  .query('getAdminAccountList', {
    input: z.object({
      page: z.string(),
      where: z.optional(z.string()),
      select: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getAdminAccountList(ctx, input)
    },
  })
  .query('getAdminAccountDetails', {
    input: z.object({
      id: z.string(),
      limit: z.optional(z.string()),
      page: z.optional(z.string()),
      select: z.optional(z.string()),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getAdminAccountDetails(ctx, input)
    },
  })
  .mutation('createAdminAccount', {
    input: z.object({
      name: z.string(),
      gender: z.string(),
      dob: z.optional(z.string()),
      avatarUrl: z.optional(z.string()),
      email: z.optional(z.string()),
      phone: z.optional(z.string()),
      username: z.string(),
      password: z.string(),
      roles: z.array(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await createAdminAccount(ctx, input)
    },
  })
  .mutation('updateAdminAccount', {
    input: z.object({
      id: z.string(),
      updateDetails: z.object({
        name: z.optional(z.string()),
        dob: z.optional(z.string()),
        gender: z.optional(z.string()),
        avatarUrl: z.optional(z.string()),
        email: z.optional(z.string()),
        phone: z.optional(z.string()),
        username: z.optional(z.string()),
        password: z.optional(z.string()),
        isActivated: z.optional(z.boolean()),
        roles: z.optional(z.array(z.string())),
      }),
    }),
    resolve: async ({ ctx, input }) => {
      return await updateAdminAccount(ctx, input)
    },
  })
