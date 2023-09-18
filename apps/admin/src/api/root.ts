import { authRouter } from './auth'
import { createRouter } from './configurations'
import { identityRouter } from './identity'
import { userRouter } from './user'
import { providerRouter } from './provider'

export const rootRouter = createRouter()
  .merge('auth.', authRouter)
  .merge('identity.', identityRouter)
  .merge('user.', userRouter)
  .merge('provider.', providerRouter)

export type RootRouterTypes = typeof rootRouter
