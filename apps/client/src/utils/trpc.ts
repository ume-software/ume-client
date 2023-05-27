import { createReactQueryHooks } from '@trpc/react'
import { RootRouterTypes } from '~/api'

export const trpc = createReactQueryHooks<RootRouterTypes>()
