import { z } from 'zod'

import { createRouter } from './configurations'
import { getProviderService } from './services/provider-service'

export const providerRouter = createRouter().query('getProvider', {
  input: z.object({
    startCost: z.optional(z.number()),
    endCost: z.optional(z.number()),
    serviceId: z.optional(z.string()),
    name: z.optional(z.string()),
    gender: z.optional(z.string()),
    limit: z.string(),
    page: z.string(),
    order: z.optional(z.string()),
  }),
  resolve: async ({ input }) => {
    return await getProviderService(input)
  },
})
