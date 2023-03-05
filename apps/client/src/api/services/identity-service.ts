import { TRPCError } from '@trpc/server'
import { AuthApi } from 'ume-openapi-indentity'

export const loginHandler = () => {
    try {
        const response = new AuthApi().userRegisterInApp({

        })
    } catch (error) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
                'Failed to sign in.'
        })
    }
}