import { createRouter } from './configurations'
import { getListSkill } from './services/booking-service'

export const bookingRouter = createRouter().query('getListSkill', {
  resolve: async ({ ctx }) => {
    return getListSkill()
  },
})
