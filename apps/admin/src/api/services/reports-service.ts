import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse } from 'cookie'
import { AdminManageReportUserApi } from 'ume-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getReportList = async (ctx, query: { page: string; where?: string; select?: string; order?: string }) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageReportUserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetReportUser('10', query.page, query.select, query.where, '[{"createdAt":"desc"}]')

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

export const getReportDetails = async (ctx, input: { id: string; select?: string }) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageReportUserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetOneReportUser(input.id, '10', '1', input.select, undefined, undefined)

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
