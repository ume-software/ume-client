import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse } from 'cookie'
import { AdminManageBookingComplaintApi } from 'ume-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getAllComplaint = async (ctx, query: { page: string; select: string; where?: string; order?: string }) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageBookingComplaintApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetAllBookingComplaintHistory('10', query.page, query.select, query.where, query.order)

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

export const getComplaintDetails = async (ctx, query: { id; select }) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageBookingComplaintApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetBookingComplaintHistoryById(query.id, '1', '1', query.select)

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

export const updateComplaint = async (input: { id: string; complaintStatus: any }, ctx) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new AdminManageBookingComplaintApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminHandleBookingComplaintHistoryById(input.id, input.complaintStatus)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.response.data.data.message || 'Failed to update voucher',
    })
  }
}
