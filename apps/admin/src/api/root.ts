import { authRouter } from './auth'
import { createRouter } from './configurations'
import { identityRouter } from './identity'
import { providerRouter } from './provider'

export const rootRouter = createRouter()
  .merge('auth.', authRouter)
  .merge('identity.', identityRouter)
  .merge('provider.', providerRouter)

export type RootRouterTypes = typeof rootRouter
