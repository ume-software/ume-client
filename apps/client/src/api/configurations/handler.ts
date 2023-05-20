import * as trpcNext from '@trpc/server/adapters/next'

import { rootRouter } from '..'
import { createContext } from './context'

export const trpcHandler = trpcNext.createNextApiHandler({
  router: rootRouter,
  createContext,
  batching: {
    enabled: true,
  },
  onError({ error, type, path, input, ctx, req }) {
    console.log(error)
  },
})
