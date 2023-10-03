import { z } from 'zod'

import { createRouter } from './configurations'
import { getAllVoucher } from './services/voucher-service'

export const voucherRouter = createRouter().query('getAllVoucher', {
  input: z.object({ page: z.string(), where: z.optional(z.string()), order: z.optional(z.string()) }),
  resolve: async ({ ctx, input }) => {
    return await getAllVoucher(ctx, input)
  },
})
