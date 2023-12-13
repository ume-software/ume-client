import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse } from 'cookie'
import { AdminManageStatisticApi, AdminManageUserApi } from 'ume-service-openapi'

import { StatisticNewUserType, UnitQueryTime } from '~/utils/constant'
import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getUserList = async (ctx, query: { page: string; where?: string; order?: string }) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageUserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetListUser('10', query.page, '["$all"]', query.where, query.order)

    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Authentication failed',
    })
  }
}

export const getUserCoinHistories = async (
  ctx,
  query: { slug: string; page: string; where?: string; order?: string },
) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageUserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetUserBalanceHistoryBySlug(query.slug, '10', query.page, '["$all"]', query.where, query.order)

    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Authentication failed',
    })
  }
}

export const getUserTotalCoin = async (ctx, { slug }) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageUserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetTotalBalanceByUserSlug(slug)

    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Authentication failed',
    })
  }
}

export const banUser = async (ctx, { slug }) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageUserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminBanUserBySlug(slug)

    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Authentication failed',
    })
  }
}
export const unBanUser = async (ctx, { slug }) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageUserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminUnBanUserBySlug(slug)

    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Authentication failed',
    })
  }
}

export const statisticNewMember = async (
  ctx,
  type: StatisticNewUserType,
  query: { time: number; unit: UnitQueryTime },
) => {
  try {
    let response
    const cookies = parse(ctx.req.headers.cookie ?? '')
    if (type === StatisticNewUserType.NEW_PROVIDER) {
      response = await new AdminManageStatisticApi({
        basePath: getEnv().baseUmeServiceURL,
        isJsonMime: () => true,
        accessToken: cookies['accessToken'],
      }).adminGetNewProviderStatistic(query.time, query.unit, UnitQueryTime.MONTH)
    } else if (type === StatisticNewUserType.NEW_USER) {
      response = await new AdminManageStatisticApi({
        basePath: getEnv().baseUmeServiceURL,
        isJsonMime: () => true,
        accessToken: cookies['accessToken'],
      }).adminGetNewUserStatistic(query.time, query.unit, UnitQueryTime.MONTH)
    }

    return {
      data: response.data || null,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Statistic transaction failed',
    })
  }
}

export const statisticTotalUser = async (ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')

    const response = await new AdminManageStatisticApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetTotalUser()

    return response.data
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Statistic transaction failed',
    })
  }
}

export const statisticTotalProvider = async (ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')

    const response = await new AdminManageStatisticApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetTotalProvider()

    return response.data
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Statistic transaction failed',
    })
  }
}

export const statisticNewUser = async (
  ctx,
  query: { time: number; unit: UnitQueryTime; type: StatisticNewUserType },
) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    let response

    if (query.type === StatisticNewUserType.NEW_PROVIDER) {
      response = await new AdminManageStatisticApi({
        basePath: getEnv().baseUmeServiceURL,
        isJsonMime: () => true,
        accessToken: cookies['accessToken'],
      }).adminGetNewProviderStatistic(query.time, query.unit, UnitQueryTime.MONTH)
    } else if (query.type === StatisticNewUserType.NEW_USER) {
      response = await new AdminManageStatisticApi({
        basePath: getEnv().baseUmeServiceURL,
        isJsonMime: () => true,
        accessToken: cookies['accessToken'],
      }).adminGetNewUserStatistic(query.time, query.unit, UnitQueryTime.MONTH)
    }

    return response?.data
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Statistic transaction failed',
    })
  }
}
