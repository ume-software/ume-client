import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse, serialize } from 'cookie'
import { AdminManageProviderApi } from 'ume-service-openapi'

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
    console.log(cookies['accessToken'])
    const response = await new AdminManageProviderApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetListProvider(query?.limit, query?.page, query?.select, query?.where, query?.order)
    return {
      data: response.data,
      success: true,
      message: 'Success',
    }
  } catch (error) {
    console.log('error at catch', error)
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
    console.log(cookies['accessToken'])
    const response = await new AdminManageProviderApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetProviderBySlug(query?.slug!!, query?.limit, query?.page, query?.select, query?.where, query?.order)
    return {
      data: response.data,
      success: true,
      message: 'Success',
    }
  } catch (error) {
    console.log('error at catch', error)
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
    console.log(cookies['accessToken'])
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
      message: 'Success',
    }
  } catch (error) {
    console.log('error at catch', error)
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
    console.log(cookies['accessToken'])
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
      message: 'Success',
    }
  } catch (error) {
    console.log('error at catch', error)
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
    console.log(cookies['accessToken'])
    const response = await new AdminManageProviderApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetBookingStatisticsByProviderSlug(query?.slug!!)
    return {
      data: response.data,
      success: true,
      message: 'Success',
    }
  } catch (error) {
    console.log('error at catch', error)
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
    console.log(cookies['accessToken'])
    const response = await new AdminManageProviderApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetTotalCoinByProviderSlug(query?.slug!!)
    return {
      data: response.data,
      success: true,
      message: 'Success',
    }
  } catch (error) {
    console.log('error at catch', error)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get getProviderTotalCoin',
    })
  }
}
export const BanProvider = async ({ slug }, ctx) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new AdminManageProviderApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminBanProviderBySlug(slug)
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
