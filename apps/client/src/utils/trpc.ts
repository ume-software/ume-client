import { createReactQueryHooks } from '@trpc/react'
import { RootRouterTypes } from '~/apis'

export const trpc = createReactQueryHooks<RootRouterTypes>()
