import { z } from 'zod'

import { createRouter } from './configurations'
import { getDepositDetail } from './services/transaction-services'

export const transactionRouter = createRouter().query('getDepositDetail', {
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
