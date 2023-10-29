import { z } from 'zod'

import { createRouter } from './configurations'
import { getDepositDetail, getDepositTransactions } from './services/transaction-service'

export const transactionRouter = createRouter()
  .query('getDepositTransactions', {
    input: z.object({
      page: z.string(),
      select: z.optional(z.string()),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getDepositTransactions(ctx, input)
    },
  })
  .query('getDepositDetail', {
    input: z.object({
      id: z.string(),
      select: z.optional(z.string()),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getDepositDetail(ctx, input)
    },
  })
