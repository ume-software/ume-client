import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'

import { getServerSession } from 'next-auth/next'

export async function createContext(options: trpcNext.CreateNextContextOptions) {
  return {
    req: options.req,
    res: options.res,
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
