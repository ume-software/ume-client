import { authRouter } from './auth'
import { createRouter } from './configurations'
import { identityRouter } from './identity'

export const rootRouter = createRouter().merge('auth.', authRouter).merge('identity.', identityRouter)

export type RootRouterTypes = typeof rootRouter
