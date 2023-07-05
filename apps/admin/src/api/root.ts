import { authRouter } from './auth'
import { createRouter } from './configurations'

export const rootRouter = createRouter().merge('auth.', authRouter)

export type RootRouterTypes = typeof rootRouter
