import { authRouter } from './auth'
import { bookingRouter } from './booking'
import { chattingRouter } from './chatting'
import { createRouter } from './configurations'
import { identityRouter } from './identity'

export const rootRouter = createRouter()
  .merge('booking.', bookingRouter)
  .merge('auth.', authRouter)
  .merge('identity.', identityRouter)
  .merge('chatting.',chattingRouter)
export type RootRouterTypes = typeof rootRouter
