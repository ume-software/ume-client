import { createRouter } from './configurations'
import { getListSkill, getProviders } from './services/booking-service'

export const bookingRouter = createRouter()
  .query('getListSkill', {
    resolve: async ({ ctx }) => {
      return await getListSkill()
    },
  })
  .query('getProviders', {
    resolve: async ({ ctx }) => {
      return await getProviders()
    },
  })
