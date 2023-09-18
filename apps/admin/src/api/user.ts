import { z } from 'zod'

import { createRouter } from './configurations'
import { getUserList } from './services/user-service'

export const userRouter = createRouter().query('getUserList', {
  input: z.object({ page: z.string(), where: z.optional(z.string()), order: z.optional(z.string()) }),
  resolve: async ({ ctx, input }) => {
    return await getUserList(ctx, input)
  },
})
