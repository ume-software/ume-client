import { z } from 'zod'

import { createRouter } from './configurations'
import { getReportDetails, getReportList } from './services/reports-service'

export const reportRouter = createRouter()
  .query('getReportList', {
    input: z.object({
      page: z.string(),
      where: z.optional(z.string()),
      select: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getReportList(ctx, input)
    },
  })
  .query('getReportDetails', {
    input: z.object({
      id: z.string(),
      select: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getReportDetails(ctx, input)
    },
  })
