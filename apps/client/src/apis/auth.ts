import { z } from 'zod'

import { createRouter } from './configurations'
import { signinService } from './services/auth-service'

export const authRouter = createRouter().mutation('signin', {
  input: z.object({
    type: z.string(),
    token: z.string(),
  }),
  resolve: async ({ ctx, input }) => {
    return await signinService(input, ctx)
  },
})
