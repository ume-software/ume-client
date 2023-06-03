import { authRouter } from './auth'
import { bookingRouter } from './booking'
import { createRouter } from './configurations'

export const rootRouter = createRouter().merge('booking.', bookingRouter).merge('auth.', authRouter)

export type RootRouterTypes = typeof rootRouter
