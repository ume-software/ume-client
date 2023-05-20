import { bookingRouter } from './booking'
import { createRouter } from './configurations'

export const rootRouter = createRouter().merge('booking.', bookingRouter)

export type RootRouterTypes = typeof rootRouter
