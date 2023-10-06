import {
  CreateVoucherRequestDiscountUnitEnum,
  CreateVoucherRequestRecipientTypeEnum,
  CreateVoucherRequestTypeEnum,
  UpdateUserProfileRequestGenderEnum,
} from 'ume-service-openapi'
import { z } from 'zod'

import { createRouter } from './configurations'
import {
  getAccountBalance,
  getIdentityInfo,
  getUserBySlug,
  providerCreateVoucher,
  providerGetSelfVoucher,
  requestRecharge,
  updateUserProfile,
  userKYC,
} from './services/identity-service'

export const identityRouter = createRouter()
  .query('identityInfo', {
    resolve: async ({ ctx }) => {
      return await getIdentityInfo(ctx)
    },
  })
  .query('account-balance', {
    resolve: async ({ ctx }) => {
      return await getAccountBalance(ctx)
    },
  })
  .mutation('request-recharge', {
    input: z.object({
      platform: z.string(),
      total: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      return await requestRecharge(input, ctx)
    },
  })
  .query('getUserBySlug', {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      return await getUserBySlug(input, ctx)
    },
  })
  .mutation('updateUserProfile', {
    input: z.object({
      name: z.optional(z.string()),
      slug: z.optional(z.string()),
      gender: z.optional(z.nativeEnum(UpdateUserProfileRequestGenderEnum)),
      dob: z.optional(z.string()),
      avatarUrl: z.optional(z.string()),
    }),
    resolve: async ({ input, ctx }) => {
      return await updateUserProfile(input, ctx)
    },
  })
  .mutation('userKYC', {
    input: z.object({
      frontSideCitizenIdImageUrl: z.string(),
      backSideCitizenIdImageUrl: z.string(),
      portraitImageUrl: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      return await userKYC(input, ctx)
    },
  })
  .query('providerGetSelfVoucher', {
    input: z.object({
      limit: z.string(),
      page: z.string(),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ input, ctx }) => {
      return await providerGetSelfVoucher(input, ctx)
    },
  })
  .mutation('providerCreateVoucher', {
    input: z.object({
      code: z.optional(z.string()),
      image: z.optional(z.string()),
      name: z.string(),
      description: z.optional(z.string()),
      numberIssued: z.optional(z.number()),
      dailyNumberIssued: z.optional(z.number()),
      numberUsablePerBooker: z.optional(z.number()),
      dailyUsageLimitPerBooker: z.optional(z.number()),
      isActivated: z.optional(z.boolean()),
      type: z.nativeEnum(CreateVoucherRequestTypeEnum),
      discountUnit: z.nativeEnum(CreateVoucherRequestDiscountUnitEnum),
      discountValue: z.optional(z.number()),
      maximumDiscountValue: z.optional(z.number()),
      minimumBookingTotalPriceForUsage: z.optional(z.number()),
      minimumBookingDurationForUsage: z.optional(z.number()),
      startDate: z.optional(z.string()),
      endDate: z.optional(z.string()),
      applyISODayOfWeek: z.optional(z.array(z.number())),
      recipientType: z.nativeEnum(CreateVoucherRequestRecipientTypeEnum),
      selectiveBookerIds: z.optional(z.array(z.string())),
      isHided: z.optional(z.boolean()),
    }),
    resolve: async ({ input, ctx }) => {
      return await providerCreateVoucher(input, ctx)
    },
  })
