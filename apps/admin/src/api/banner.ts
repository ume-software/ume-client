import { z } from 'zod'

import { createRouter } from './configurations'
import { getBannerDetails, getBannerList } from './services/banner-service'

export const bannerRouter = createRouter()
  .query('getBannerList', {
    input: z.object({
      limit: z.string(),
      page: z.string(),
      where: z.optional(z.string()),
      select: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getBannerList(ctx, input)
    },
  })
  .query('getBannerDetails', {
    input: z.object({
      id: z.string(),
      select: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getBannerDetails(ctx, input)
    },
  })
