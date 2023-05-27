import { TRPCError } from '@trpc/server'

export const loginHandler = () => {
  try {
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Failed to sign in.',
    })
  }
}
