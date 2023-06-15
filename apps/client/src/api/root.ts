import { authRouter } from './auth'
import { bookingRouter } from './booking'
import { communityRouter } from './community'
import { createRouter } from './configurations'
import { identityRouter } from './identity'

export const rootRouter = createRouter()
  .merge('booking.', bookingRouter)
  .merge('auth.', authRouter)
  .merge('identity.', identityRouter)
  .merge('community.', communityRouter)

export type RootRouterTypes = typeof rootRouter
