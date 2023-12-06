import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse } from 'cookie'
import {
  AdminHandleBanProviderRequest,
  AdminManageProviderApi,
  AdminManageUserKYCRequestApi,
  UserKYCRequestResponse,
} from 'ume-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getProviderList = async (
  ctx,
  query?: {
    limit?: string
    page?: string
    select?: string
    where?: string
    order?: string
  },
) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageProviderApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetListProvider(query?.limit, query?.page, query?.select, query?.where, query?.order)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list provider',
    })
  }
}

export const getProviderDetail = async (
  ctx,
  query?: {
    slug: string
    limit?: string
    page?: string
    select?: string
    where?: string
    order?: string
  },
) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageProviderApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetProviderBySlug(query?.slug!!, query?.limit, query?.page, query?.select, query?.where, query?.order)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get provider detail',
    })
  }
}

export const getProviderSkill = async (
  ctx,
  query?: {
    slug: string
    limit?: string
    page?: string
    select?: string
    where?: string
    order?: string
  },
) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageProviderApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetProviderServiceByProviderSlug(
      query?.slug!!,
      query?.limit,
      query?.page,
      query?.select,
      query?.where,
      query?.order,
    )
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get provider skill',
    })
  }
}

export const getProviderBookingHistory = async (
  ctx,
  query?: {
    slug: string
    limit?: string
    page?: string
    select?: string
    where?: string
    order?: string
  },
) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageProviderApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetBookingHistoryByProviderSlug(
      query?.slug!!,
      query?.limit,
      query?.page,
      query?.select,
      query?.where,
      query?.order,
    )
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get getProviderBookingHistory',
    })
  }
}

export const getProviderBookingStatistics = async (
  ctx,
  query?: {
    slug: string
  },
) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageProviderApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetBookingStatisticsByProviderSlug(query?.slug!!)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get getProviderBookingStatistics',
    })
  }
}

export const getProviderTotalCoin = async (
  ctx,
  query?: {
    slug: string
  },
) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageProviderApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetTotalBalanceByProviderSlug(query?.slug!!)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get getProviderTotalCoin',
    })
  }
}
export const BanProvider = async (
  query: { slug: string; adminHandleBanProviderRequest?: AdminHandleBanProviderRequest },
  ctx,
) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new AdminManageProviderApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminBanProviderBySlug(query.slug, query.adminHandleBanProviderRequest)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to BanProvider',
    })
  }
}

export const UnBanProvider = async ({ slug }, ctx) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new AdminManageProviderApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminUnBanProviderBySlug(slug)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to UnBanProvider',
    })
  }
}

export const getListKYC = async (
  ctx,
  query?: {
    limit?: string
    page?: string
    select?: string
    where?: string
    order?: string
  },
) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new AdminManageUserKYCRequestApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetListUserKYCRequest(query?.limit, query?.page, query?.select, query?.where, '[{"createdAt":"desc"}]')

    const res = response.data.row?.map((data: UserKYCRequestResponse) => ({
      ...data.user,
      backSideCitizenIdImageUrl: data.backSideCitizenIdImageUrl,
      frontSideCitizenIdImageUrl: data.frontSideCitizenIdImageUrl,
      portraitImageUrl: data.portraitImageUrl,
      status: data?.userKYCStatus,
      requestId: data.id,
      citizenId: data.citizenId,
      citizenDod: data.citizenDob,
      citizenName: data.citizenName,
      citizenGender: data.citizenGender,
    }))

    return {
      data: res,
      successs: true,
      count: response.data.count,
      pagination: response.data.pagination,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list KYC.',
    })
  }
}

export const kcyAction = async (ctx, { id, action }) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    let response = new AdminManageUserKYCRequestApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    })
    if (action === 'APPROVE') {
      await response.adminApprovedUserKYCRequest(id)
    } else if (action === 'REJECT') {
      await response.adminRejectedUserKYCRequest(id)
    }
    return {
      data: response,
      successs: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || `Failed to ${action} KYC for user have ${id}.`,
    })
  }
}
