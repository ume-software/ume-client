import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse } from 'cookie'
import { AdminApi } from 'ume-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getAdminAccountList = async (
  ctx,
  query: { page: string; where?: string; select?: string; order?: string },
) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).supperAdminGetListAdminAccount('10', query.page, query.select, query.where, '[{"createdAt":"desc"}]')

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

export const getAdminAccountDetails = async (
  ctx,
  input: { id: string; limit?: string; page?: string; select?: string; where?: string; order?: string },
) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).supperAdminGetAdminById(input.id, input.limit, input.page, input.select, input.where, input.order)

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

export const createAdminAccount = async (ctx, input: any) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminCreateAccount(input)

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

export const updateAdminAccount = async (ctx, input: { id: string; updateDetails: any }) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).supperUpdateAdminById(input.id, input.updateDetails)

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
