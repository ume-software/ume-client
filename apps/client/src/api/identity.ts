import { createRouter } from './configurations'
import { getIdentityInfo } from './services/identity-service'

export const identityRouter = createRouter().query('identityInfo', {
  resolve: async ({ ctx }) => {
    return await getIdentityInfo(ctx)
  },
})
