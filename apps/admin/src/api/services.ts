import { z } from 'zod'

import { createRouter } from './configurations'
import { getServiceList } from './services/services-service'

export const servicesRouter = createRouter().query('getServiceList', {
  input: z.object({
    page: z.string(),
    select: z.optional(z.string()),
    where: z.optional(z.string()),
    order: z.optional(z.string()),
  }),
  resolve: async ({ ctx, input }) => {
    return await getServiceList(ctx, input)
  },
})
