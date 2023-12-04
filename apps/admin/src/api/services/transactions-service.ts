import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse } from 'cookie'
import {
  AdminHandleWithdrawalRequestStatusEnum,
  AdminManageBookingApi,
  AdminManageDepositRequestApi,
  AdminManageDonationApi,
  AdminManageStatisticApi,
  AdminManageWithdrawalRequestApi,
} from 'ume-service-openapi'

import { TransactionType, UnitQueryTime } from '~/utils/constant'
import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getDepositTransactions = async (
  ctx,
  query: { page: string; select?: string; where?: string; order?: string },
) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageDepositRequestApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetListDepositRequest('10', query.page, query.select, query.where, query.order)

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

export const getBookingTransactions = async (
  ctx,
  query: {
    limit?: string
    page: string
    select?: string
    where?: string
    order?: string
  },
) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageBookingApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetListBookingHistory(query.limit, query.page, query.select, query.where, '[{"createdAt":"desc"}]')

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

export const getDonationTransactions = async (
  ctx,
  query: {
    limit?: string
    page: string
    select?: string
    where?: string
    order?: string
  },
) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageDonationApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetListDonation(query.limit, query.page, query.select, query.where, '[{"createdAt":"desc"}]')

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

export const getDepositDetail = async (
  ctx,
  query?: {
    id: string
    select?: string
  },
) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageDepositRequestApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetOneDepositRequest(query?.id!!, query?.select)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get Deposit detail',
    })
  }
}

export const getWaitingTransactions = async (
  ctx,
  query?: {
    limit?: string
    page?: string
    select?: string
    where?: string
    order?: string
  },
) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const response = await new AdminManageWithdrawalRequestApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetListWithdrawalRequest(query?.limit, query?.page, query?.select, query?.where, '[{"createdAt":"desc"}]')

    return {
      data: response.data.row,
      success: true,
      count: response.data.count,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Get waiting transactions failed',
    })
  }
}
export const getWithdrawalDetails = async (
  ctx,
  input: { id: string; limit?: string; page?: string; select?: string; where?: string; order?: string },
) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageWithdrawalRequestApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetOneWithdrawalRequest(input.id, input.limit, input.page, input.select, input.where, input.order)

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

export const approveWithdrawal = async (id: string, action: any, ctx) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const response = await new AdminManageWithdrawalRequestApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminHandleWithdrawalRequest(id, action)

    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Approve withdrawal failed',
    })
  }
}

export const statisticTransasction = async (
  ctx,
  type: TransactionType,
  query: { time: number; unit: UnitQueryTime },
) => {
  try {
    let res
    const cookies = parse(ctx.req.headers.cookie ?? '')
    if (type === TransactionType.DEPOSIT) {
      res = await new AdminManageStatisticApi({
        basePath: getEnv().baseUmeServiceURL,
        isJsonMime: () => true,
        accessToken: cookies['accessToken'],
      }).adminGetAmountMoneyDepositStatistics(query.time, query.unit, UnitQueryTime.MONTH)
    } else if (type === TransactionType.WITHDRAW) {
      res = await new AdminManageStatisticApi({
        basePath: getEnv().baseUmeServiceURL,
        isJsonMime: () => true,
        accessToken: cookies['accessToken'],
      }).adminGetAmountMoneyWithdrawalStatistics(query.time, query.unit, UnitQueryTime.MONTH)
    }
    return {
      data: res.data || null,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Statistic transaction failed',
    })
  }
}
