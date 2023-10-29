import { z } from 'zod'

import { createRouter } from './configurations'
import { getDepositTransactions } from './services/transaction-service'

export const transactionRouter = createRouter().query('getDepositTransactions', {
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
