import { z } from 'zod'

import { createRouter } from './configurations'
import { signinHandler } from './services/identity-service'

export const authRouter = createRouter().mutation('signin', {
  input: z.object({
    type: z.string(),
    token: z.string(),
  }),
  resolve: async ({ ctx, input }) => {
    return await signinHandler(input, ctx)
  },
})
