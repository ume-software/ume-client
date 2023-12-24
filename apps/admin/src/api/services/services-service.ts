import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse } from 'cookie'
import {
  AdminManageServiceApi,
  AdminManageStatisticApi,
  CreateServiceRequest,
  UpdateServiceRequest,
} from 'ume-service-openapi'

import { UnitQueryTime } from '~/utils/constant'
import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getServiceList = async (ctx, query: { page: string; select?: string; where?: string; order?: string }) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageServiceApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetAllServices('10', query.page, query.select || '["$all"]', query.where, '[{"createdAt":"desc"}]')

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

export const createService = async (input: CreateServiceRequest, ctx) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new AdminManageServiceApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminCreateService(input)

    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to create service',
    })
  }
}

export const getServiceDetails = async (ctx, query: { id; select }) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageServiceApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetServiceBySlug(query.id, undefined, undefined, query.select, undefined, undefined)
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

export const updateService = async (input: { id: string; updateServiceRequest: UpdateServiceRequest }, ctx) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new AdminManageServiceApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminUpdateServiceById(input.id, input.updateServiceRequest)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    console.error('Failed to update service', error.response.data)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.response.data.data.message || 'Failed to update service',
    })
  }
}

export const statisticService = async (ctx, amount) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageStatisticApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetMostProviderServicesStatistics(amount)

    return response.data
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.response.data.data.message || 'Failed to statistic service',
    })
  }
}

export const statisticMostUsedService = async (ctx, amount) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageStatisticApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetMostBookingServicesStatistics(amount)

    return response.data
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.response.data.data.message || 'Failed to statistic service',
    })
  }
}

export const statsticWidrawalAndDeposit = async (ctx, query: { time: number; unit: UnitQueryTime }) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageStatisticApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetAmountMoneyDepositStatistics(query.time, query.unit, 'months')

    return response.data
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.response.data.data.message || 'Failed to statistic service',
    })
  }
}
