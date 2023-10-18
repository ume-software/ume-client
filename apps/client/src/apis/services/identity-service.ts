import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse } from 'cookie'
import {
  AuthApi,
  BuyCoinRequestApi,
  CoinApi,
  CreateVoucherRequest,
  ProviderServiceApi,
  ServiceApi,
  ServiceAttributeApi,
  UpdateUserProfileRequestGenderEnum,
  UpdateVoucherRequest,
  UserApi,
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
    const response = await new CoinApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getTotalCoin()
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
    const reponse = await new BuyCoinRequestApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).createBuyCoinRequest({
      amountCoin: Number.parseInt(total),
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

export const updateUserProfile = async (
  query: {
    name?: string
    slug?: string
    gender?: UpdateUserProfileRequestGenderEnum
    dob?: string
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
    }).providerGetSelfVoucher(query.limit, query.page, '["$all"]', query.where, query.order)
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

export const getMyVoucher = async (input: { limit: string; page: string; where?: string; order?: string }, ctx) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new VoucherApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getMyVoucher(input.limit, input.page, '["$all"]', input.where, input.order)
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
    }).providerGetOwnServices('unlimited', '1', '["$all"]', '{}', '[]')
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
    const reponse = await new CoinApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getHistoryCoin(query.limit, query.page, '["$all"]', query.where, query.order)
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get coin history',
    })
  }
}
