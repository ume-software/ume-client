import { GenderEnum } from '~/enumVariable/enumVariable'

import {
  AttachmentRequestTypeEnum,
  CreateBookingComplaintRequestComplaintTypeEnum,
  CreateVoucherRequestDiscountUnitEnum,
  CreateVoucherRequestRecipientTypeEnum,
  CreateVoucherRequestTypeEnum,
  CreateWithdrawalRequestUnitCurrencyEnum,
  UpdateProviderProfileRequestStatusEnum,
  UpdateUserProfileRequestGenderEnum,
  UserPaymentSystemRequestPlatformEnum,
} from 'ume-service-openapi'
import { z } from 'zod'

import { createRouter } from './configurations'
import {
  FollowProvider,
  UnFollowProvider,
  bookingHistoryForProvider,
  bookingHistoryForUser,
  cancelWithdrawRequests,
  checkSlugUser,
  createComplain,
  createServiceProvider,
  createUserPaymentSystem,
  createWithdrawRequests,
  deleteServiceProvider,
  deleteUserPaymentSystem,
  getAccountBalance,
  getHistoryTransaction,
  getIdentityInfo,
  getServiceAttributeByServiceSlug,
  getServiceAttributeValueByServiceAttributeId,
  getUserBySlug,
  getUserPaymentSystems,
  getWithdrawRequests,
  providerCheckVoucherCode,
  providerCreateVoucher,
  providerGetOwnServices,
  providerGetSelfVoucher,
  providerGetServiceHaveNotRegistered,
  providerUpdateVoucher,
  registerBecomeProvider,
  requestRecharge,
  transactionHistoryStatistic,
  updateServiceProvider,
  updateUserProfile,
  userKYC,
  userUpdateProviderProfile,
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
      total: z.number(),
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
  .query('checkSlugUser', {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      return await checkSlugUser(input, ctx)
    },
  })
  .mutation('updateUserProfile', {
    input: z.object({
      name: z.optional(z.string()),
      slug: z.optional(z.string()),
      gender: z.optional(z.nativeEnum(UpdateUserProfileRequestGenderEnum)),
      dob: z.optional(z.string()),
      phone: z.optional(z.string()),
      avatarUrl: z.optional(z.string()),
      isAllowNotificationToEmail: z.optional(z.boolean()),
      isAllowNotificationMessage: z.optional(z.boolean()),
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
      citizenId: z.string(),
      citizenName: z.string(),
      citizenDob: z.string(),
      citizenGender: z.enum([GenderEnum.FEMALE, GenderEnum.MALE]),
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
  .query('providerCheckVoucherCode', {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      return await providerCheckVoucherCode(input, ctx)
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
  .mutation('providerUpdateVoucher', {
    input: z.object({
      id: z.string(),
      body: z.object({
        code: z.optional(z.string()),
        image: z.optional(z.string()),
        name: z.optional(z.string()),
        description: z.optional(z.string()),
        numberIssued: z.optional(z.number()),
        dailyNumberIssued: z.optional(z.number()),
        numberUsablePerBooker: z.optional(z.number()),
        dailyUsageLimitPerBooker: z.optional(z.number()),
        isActivated: z.optional(z.boolean()),
        type: z.optional(z.nativeEnum(CreateVoucherRequestTypeEnum)),
        discountUnit: z.optional(z.nativeEnum(CreateVoucherRequestDiscountUnitEnum)),
        discountValue: z.optional(z.number()),
        maximumDiscountValue: z.optional(z.number()),
        minimumBookingTotalPriceForUsage: z.optional(z.number()),
        minimumBookingDurationForUsage: z.optional(z.number()),
        startDate: z.optional(z.string()),
        endDate: z.optional(z.string()),
        applyISODayOfWeek: z.optional(z.array(z.number())),
        recipientType: z.optional(z.nativeEnum(CreateVoucherRequestRecipientTypeEnum)),
        selectiveBookerIds: z.optional(z.array(z.string())),
        isHided: z.optional(z.boolean()),
      }),
    }),
    resolve: async ({ input, ctx }) => {
      return await providerUpdateVoucher(input, ctx)
    },
  })

  .mutation('registerBecomeProvider', {
    resolve: async ({ ctx }) => {
      return await registerBecomeProvider(ctx)
    },
  })
  .query('providerGetServiceHaveNotRegistered', {
    resolve: async ({ ctx }) => {
      return await providerGetServiceHaveNotRegistered(ctx)
    },
  })
  .query('getServiceAttributeByServiceSlug', {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      return await getServiceAttributeByServiceSlug(input, ctx)
    },
  })
  .query('getServiceAttributeValueByServiceAttributeId', {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      return await getServiceAttributeValueByServiceAttributeId(input, ctx)
    },
  })
  .query('providerGetOwnServices', {
    resolve: async ({ ctx }) => {
      return await providerGetOwnServices(ctx)
    },
  })
  .mutation('updateServiceProvider', {
    input: z.object({
      serviceId: z.string(),
      position: z.number(),
      defaultCost: z.number(),
      description: z.optional(z.string()),
      handleBookingCosts: z.optional(
        z.array(z.object({ startTimeOfDay: z.string(), endTimeOfDay: z.string(), amount: z.number() })),
      ),
      handleProviderServiceAttributes: z.optional(
        z.array(
          z.object({
            id: z.string(),
            handleServiceAttributeValueIds: z.array(z.string()),
          }),
        ),
      ),
    }),
    resolve: async ({ input, ctx }) => {
      return await updateServiceProvider(input, ctx)
    },
  })
  .mutation('createServiceProvider', {
    input: z.object({
      serviceId: z.string(),
      position: z.number(),
      defaultCost: z.number(),
      description: z.optional(z.string()),
      createBookingCosts: z.optional(
        z.array(z.object({ startTimeOfDay: z.string(), endTimeOfDay: z.string(), amount: z.number() })),
      ),
      createServiceAttributes: z.optional(
        z.array(
          z.object({
            id: z.string(),
            serviceAttributeValueIds: z.array(z.string()),
          }),
        ),
      ),
    }),
    resolve: async ({ input, ctx }) => {
      return await createServiceProvider(input, ctx)
    },
  })
  .mutation('deleteServiceProvider', {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      return await deleteServiceProvider(input, ctx)
    },
  })
  .query('getHistoryTransaction', {
    input: z.object({
      limit: z.string(),
      page: z.string(),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ input, ctx }) => {
      return await getHistoryTransaction(input, ctx)
    },
  })
  .query('getUserPaymentSystems', {
    resolve: async ({ ctx }) => {
      return await getUserPaymentSystems(ctx)
    },
  })
  .mutation('createUserPaymentSystem', {
    input: z.object({
      platform: z.nativeEnum(UserPaymentSystemRequestPlatformEnum),
      platformAccount: z.string(),
      beneficiary: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      return await createUserPaymentSystem(input, ctx)
    },
  })
  .mutation('deleteUserPaymentSystem', {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      return await deleteUserPaymentSystem(input, ctx)
    },
  })
  .query('getWithdrawRequests', {
    input: z.object({
      limit: z.string(),
      page: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      return await getWithdrawRequests(input, ctx)
    },
  })
  .mutation('createWithdrawRequests', {
    input: z.object({
      amountBalance: z.number(),
      unitCurrency: z.nativeEnum(CreateWithdrawalRequestUnitCurrencyEnum),
      userPaymentSystemId: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      return await createWithdrawRequests(input, ctx)
    },
  })
  .mutation('cancelWithdrawRequests', {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      return await cancelWithdrawRequests(input, ctx)
    },
  })
  .mutation('userUpdateProviderProfile', {
    input: z.object({
      voiceUrl: z.optional(z.string()),
      status: z.optional(z.nativeEnum(UpdateProviderProfileRequestStatusEnum)),
      description: z.optional(z.string()),
    }),
    resolve: async ({ input, ctx }) => {
      return await userUpdateProviderProfile(input, ctx)
    },
  })
  .mutation('FollowProvider', {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      return await FollowProvider(input, ctx)
    },
  })
  .mutation('UnFollowProvider', {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      return await UnFollowProvider(input, ctx)
    },
  })
  .query('transactionHistoryStatistic', {
    resolve: async ({ ctx }) => {
      return await transactionHistoryStatistic(ctx)
    },
  })
  .query('bookingHistoryForUser', {
    input: z.object({
      limit: z.string(),
      page: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      return await bookingHistoryForUser(input, ctx)
    },
  })
  .query('bookingHistoryForProvider', {
    input: z.object({
      limit: z.string(),
      page: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      return await bookingHistoryForProvider(input, ctx)
    },
  })
  .mutation('createComplain', {
    input: z.object({
      bookingId: z.string(),
      complaintDescription: z.string(),
      complaintType: z.nativeEnum(CreateBookingComplaintRequestComplaintTypeEnum),
      attachments: z.array(
        z.object({
          url: z.string(),
          type: z.nativeEnum(AttachmentRequestTypeEnum),
        }),
      ),
    }),
    resolve: async ({ input, ctx }) => {
      return await createComplain(input, ctx)
    },
  })
