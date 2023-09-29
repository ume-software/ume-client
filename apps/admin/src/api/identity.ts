import { createRouter } from './configurations'
import { getIdentityInfo } from './services/identity-service'

export const identityRouter = createRouter().query('adminInfo', {
  resolve: async ({ ctx }) => {
    return await getIdentityInfo(ctx)
  },
})
