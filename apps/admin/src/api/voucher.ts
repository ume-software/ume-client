import { CreateVoucherRequest } from 'ume-service-openapi'
import { z } from 'zod'

import { createRouter } from './configurations'
import { createNewVoucherAdmin, getAllVoucher } from './services/voucher-service'

export const voucherRouter = createRouter()
  .query('getAllVoucher', {
    input: z.object({ page: z.string(), where: z.optional(z.string()), order: z.optional(z.string()) }),
    resolve: async ({ ctx, input }) => {
      return await getAllVoucher(ctx, input)
    },
  })
  .mutation('createNewVoucherAdmin', {
    input: z.object({
      code: z.optional(z.string()),
      image: z.optional(z.string()),
      // content: z.optional(z.string()),
      name: z.string(),
      description: z.optional(z.string()),
      numberIssued: z.optional(z.number()),
      dailyNumberIssued: z.optional(z.number()),
      numberUsablePerBooker: z.optional(z.number()),
      dailyUsageLimitPerBooker: z.optional(z.number()),
      isActivated: z.optional(z.boolean()),
      type: z.optional(z.string()), //CreateVoucherRequestTypeEnum
      discountUnit: z.string(), //CreateVoucherRequestDiscountUnitEnum
      discountValue: z.optional(z.number()),
      maximumDiscountValue: z.optional(z.number()),
      minimumBookingTotalPriceForUsage: z.optional(z.number()),
      minimumBookingDurationForUsage: z.optional(z.number()),
      startDate: z.optional(z.string()),
      endDate: z.optional(z.string()),
      applyISODayOfWeek: z.optional(z.array(z.number())),
      recipientType: z.string(), //CreateVoucherRequestRecipientTypeEnum
      selectiveBookerIds: z.optional(z.array(z.string())),
      isHided: z.boolean(),
    }),
    resolve: async ({ ctx, input }) => {
      return await createNewVoucherAdmin(input as CreateVoucherRequest, ctx)
    },
  })
