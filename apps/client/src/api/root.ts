import { authRouter } from './auth'
import { bookingRouter } from './booking'
import { chattingRouter } from './chatting'
import { communityRouter } from './community'
import { createRouter } from './configurations'
import { identityRouter } from './identity'
import { streamingRouter } from './streamning'

export const rootRouter = createRouter()
  .merge('booking.', bookingRouter)
  .merge('auth.', authRouter)
  .merge('identity.', identityRouter)
  .merge('community.', communityRouter)
  .merge('chatting.', chattingRouter)
  .merge('streaming.', streamingRouter)
export type RootRouterTypes = typeof rootRouter
