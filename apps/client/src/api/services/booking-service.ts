import { TRPCError } from '@trpc/server'

export const getListSkill = () => {
  try {
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Failed to sign in.',
    })
  }
}
