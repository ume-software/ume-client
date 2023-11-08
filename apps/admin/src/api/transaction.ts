import { z } from 'zod'

import { createRouter } from './configurations'
import { getWaitingTransactions } from './services/transactions-service'

export const transationRouter = createRouter().query('getTransactionList', {
  input: z.object({
    page: z.string(),
    select: z.optional(z.string()),
    where: z.optional(z.string()),
    order: z.optional(z.string()),
  }),
  resolve: async ({ ctx, input }) => {
    return await getWaitingTransactions(ctx, input)
  },
})
