import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse } from 'cookie'
import { AdminManageServiceApi, CreateServiceRequest, UpdateServiceRequest } from 'ume-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getServiceList = async (ctx, query: { page: string; select?: string; where?: string; order?: string }) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageServiceApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetAllServices('10', query.page, query.select || '["$all"]', query.where, query.order)

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
    console.log('Failed to update service', error.response.data)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.response.data.data.message || 'Failed to update service',
    })
  }
}
