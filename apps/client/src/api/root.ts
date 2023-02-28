import { type } from 'os'
import { createRouter } from './configurations'


export const rootRouter = createRouter()

export type RootRouterTypes = typeof rootRouter