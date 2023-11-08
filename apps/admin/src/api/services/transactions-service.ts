import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse } from 'cookie'
import { AdminManageDepositRequestApi, AdminManageWithdrawRequestApi } from 'ume-service-openapi'

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
    const response = await new AdminManageWithdrawRequestApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetListWithdrawRequest(query?.limit, query?.page, query?.select, query?.where, query?.order)

    return {
      data: response.data.row,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Get waiting transactions failed',
    })
  }
}
