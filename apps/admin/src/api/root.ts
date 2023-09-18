import { authRouter } from './auth'
import { createRouter } from './configurations'
import { identityRouter } from './identity'
import { userRouter } from './user'

export const rootRouter = createRouter()
  .merge('auth.', authRouter)
  .merge('identity.', identityRouter)
  .merge('user.', userRouter)

export type RootRouterTypes = typeof rootRouter
