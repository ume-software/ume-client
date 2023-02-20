import { type } from 'os'
import { createRouter } from './configurations/createRouter'


export const rootRouter = createRouter()

export type RootRouterTypes = typeof rootRouter