import { adminRouter } from './admin-account'
import { authRouter } from './auth'
import { bannerRouter } from './banner'
import { createRouter } from './configurations'
import { identityRouter } from './identity'
import { providerRouter } from './provider'
import { reportRouter } from './reports'
import { servicesRouter } from './services'
import { transactionRouter } from './transaction'
import { userRouter } from './user'
import { voucherRouter } from './voucher'

export const rootRouter = createRouter()
  .merge('auth.', authRouter)
  .merge('identity.', identityRouter)
  .merge('user.', userRouter)
  .merge('provider.', providerRouter)
  .merge('voucher.', voucherRouter)
  .merge('services.', servicesRouter)
  .merge('transaction.', transactionRouter)
  .merge('report.', reportRouter)
  .merge('admin.', adminRouter)
  .merge('banner.', bannerRouter)
export type RootRouterTypes = typeof rootRouter
