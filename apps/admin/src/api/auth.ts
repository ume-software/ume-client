import { z } from 'zod'

import { createRouter } from './configurations'
import { signinService } from './services/auth-service'

export const authRouter = createRouter().mutation('signin', {
  input: z.object({
    username: z.string(),
    password: z.string(),
  }),
  resolve: async ({ input, ctx }) => {
    return await signinService(input, ctx)
  },
})
