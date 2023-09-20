import { z } from 'zod'

import { createRouter } from './configurations'
import { getProviderDetail, getProviderList } from './services/provider-service'

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
