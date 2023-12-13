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

    console.log(response)

    const mappedData = Object.keys(response.data)
      .filter((key) => key !== 'totalUser')
      .map((key) => {
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1)
        return { name: formattedKey.replace('Total', ''), y: response.data[key] }
      })

    const calculateNormalUsers = (data) => {
      return data.totalUser - data.totalUserIsBanned - data.totalUserIsVerified
    }
    const normalUsersCount = calculateNormalUsers(response.data)
    mappedData.push({ name: 'NormalUsers', y: normalUsersCount })

    return {
      data: mappedData,
      success: true,
    }
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

    const mappedData = Object.keys(response.data)
      .filter((key) => key !== 'totalProvider')
      .map((key) => {
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1)
        return { name: formattedKey.replace('Total', ''), y: response.data[key] }
      })

    const calculateNormalProviders = (data) => {
      return data.totalProvider - data.totalProviderIsBanned
    }
    const normalProvidersCount = calculateNormalProviders(response.data)
    mappedData.push({ name: 'NormalProviders', y: normalProvidersCount })

    return {
      data: mappedData,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Statistic transaction failed',
    })
  }
}
