import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse } from 'cookie'
import {
  AuthApi,
  BalanceApi,
  CreateVoucherRequest,
  CreateWithdrawalRequestUnitCurrencyEnum,
  DepositRequestApi,
  ProviderServiceApi,
  ServiceApi,
  ServiceAttributeApi,
  UpdateProviderProfileRequestStatusEnum,
  UpdateUserProfileRequestGenderEnum,
  UpdateVoucherRequest,
  UserApi,
  UserPaymentSystemApi,
  UserPaymentSystemRequestPlatformEnum,
  VoucherApi,
} from 'ume-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getIdentityInfo = async (ctx) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new AuthApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getInfo()

    return {
      data: response.data,
      success: true,
      message: 'Success',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Authentication failed',
    })
  }
}

export const getAccountBalance = async (ctx) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new BalanceApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getTotalBalance()
    return {
      data: response.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get account balance',
    })
  }
}

export const requestRecharge = async ({ total, platform }, ctx) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new DepositRequestApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).createDepositRequest({
      amountBalance: total,
      platform: platform,
      unitCurrency: 'VND',
    })
    return {
      data: reponse.data,
      status: 'success',
      message: 'OK',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get data recharge',
    })
  }
}

export const getUserBySlug = async (input, ctx) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new UserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getUserBySlug(input)
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get data recharge',
    })
  }
}

export const checkSlugUser = async (input: string, ctx) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new UserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).checkSlugUserExisted(input)
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get data recharge',
    })
  }
}

export const updateUserProfile = async (
  query: {
    name?: string
    slug?: string
    gender?: UpdateUserProfileRequestGenderEnum
    dob?: string
    phone?: string
    avatarUrl?: string
  },
  ctx,
) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new UserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).updateUserProfile({
      name: query.name,
      avatarUrl: query.avatarUrl,
      dob: query.dob,
      gender: query.gender,
      phone: query.phone,
      slug: query.slug,
    })
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get data recharge',
    })
  }
}

export const userKYC = async (
  query: {
    frontSideCitizenIdImageUrl: string
    backSideCitizenIdImageUrl: string
    portraitImageUrl: string
  },
  ctx,
) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new UserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).userSendKYCRequest(query)
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get data recharge',
    })
  }
}

export const providerGetSelfVoucher = async (
  query: {
    limit: string
    page: string
    where?: string
    order?: string
  },
  ctx,
) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new VoucherApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).providerGetSelfVoucher(query.limit, query.page, '["$all"]', query.where, "[{ createdAt: 'asc' }]")
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get data voucher',
    })
  }
}

export const providerCheckVoucherCode = async (input: string, ctx) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new VoucherApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).checkVoucherCodeExisted(input)
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get voucher code',
    })
  }
}

export const providerCreateVoucher = async (query: CreateVoucherRequest, ctx) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new VoucherApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).providerCreateVoucher(query)
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get data recharge',
    })
  }
}

export const providerUpdateVoucher = async (query: { id: string; body: UpdateVoucherRequest }, ctx) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new VoucherApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).providerUpdateVoucher(query.id, query.body)
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get data recharge',
    })
  }
}

export const registerBecomeProvider = async (ctx) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new UserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).userBecomeProvider()
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to register become provider',
    })
  }
}

export const providerGetServiceHaveNotRegistered = async (ctx) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new ServiceApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).providerGetServiceHaveNotRegistered('unlimited', '1', '["$all"]')
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get data recharge',
    })
  }
}

export const getServiceAttributeByServiceSlug = async (slug: string, ctx) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new ServiceApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getServiceAttributeByServiceSlug(slug, undefined, undefined, '["$all"]')
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get data recharge',
    })
  }
}

export const getServiceAttributeValueByServiceAttributeId = async (slug: string, ctx) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new ServiceAttributeApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getServiceAttributeValueByServiceAttributeId(slug, undefined, undefined, '["$all"]')
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get data recharge',
    })
  }
}

export const providerGetOwnServices = async (ctx) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new ProviderServiceApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).providerGetOwnServices('unlimited', '1', '["$all"]', '{}', `[{ "position": "asc" }]`)
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get own service',
    })
  }
}

export const createServiceProvider = async (
  query: {
    serviceId: string
    position: number
    defaultCost: number
    description?: string
    createBookingCosts?: { startTimeOfDay: string; endTimeOfDay: string; amount: number }[]
    createServiceAttributes?: { id: string; serviceAttributeValueIds: string[] }[]
  },
  ctx,
) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new ProviderServiceApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).createProviderService(query)
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get data recharge',
    })
  }
}

export const updateServiceProvider = async (
  query: {
    serviceId: string
    position: number
    defaultCost: number
    description?: string
    handleBookingCosts?: { startTimeOfDay: string; endTimeOfDay: string; amount: number }[]
    handleProviderServiceAttributes?: { id: string; handleServiceAttributeValueIds: string[] }[]
  },
  ctx,
) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new ProviderServiceApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).updateProviderService(query)
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get data recharge',
    })
  }
}

export const getHistoryTransaction = async (
  query: { limit: string; page: string; where?: string; order?: string },
  ctx,
) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new BalanceApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getHistoryBalance(query.limit, query.page, '["$all"]', query.where, query.order)
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get balance history',
    })
  }
}

export const getUserPaymentSystems = async (ctx) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new UserPaymentSystemApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getUserPaymentSystems('unlimited', '1', '["$all"]')
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get payment system',
    })
  }
}

export const createUserPaymentSystem = async (
  query: { platform: UserPaymentSystemRequestPlatformEnum; platformAccount: string; beneficiary: string },
  ctx,
) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new UserPaymentSystemApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).createUserPaymentSystem(query)
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get payment system',
    })
  }
}

export const getWithdrawRequests = async (query: { limit: string; page: string }, ctx) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new BalanceApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getWithdrawalRequests(query.limit, query.page, '["$all",{"userPaymentSystem":["$all"]}]')
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get withdraw request',
    })
  }
}

export const createWithdrawRequests = async (
  query: { amountBalance: number; unitCurrency: CreateWithdrawalRequestUnitCurrencyEnum; userPaymentSystemId: string },
  ctx,
) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new BalanceApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).createWithdrawalRequest(query)
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to create withdraw request',
    })
  }
}

export const cancelWithdrawRequests = async (withdrawalRequestId: string, ctx) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new BalanceApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).userCancelWithdrawalRequest(withdrawalRequestId)
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to cancel withdraw request',
    })
  }
}

export const userUpdateProviderProfile = async (
  query: { voiceUrl?: string; status?: UpdateProviderProfileRequestStatusEnum; description?: string },
  ctx,
) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new UserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).userUpdateProviderProfile(query)
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to update provider profile',
    })
  }
}
