import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse } from 'cookie'
import { AdminManageVoucherApi, CreateVoucherRequest, UpdateVoucherRequest } from 'ume-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getAllVoucher = async (ctx, query: { page: string; where?: string; order?: string }) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageVoucherApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetAllVoucher('10', query.page, '["$all"]', query.where, query.order)

    return {
      data: response.data,
      success: true,
      message: 'Success',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Authentication failed',
    })
  }
}
export const getVoucherDetails = async (ctx, query: { id; select }) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AdminManageVoucherApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminGetVoucherDetail(query.id, query.select)

    return {
      data: response.data,
      success: true,
      message: 'Success',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Authentication failed',
    })
  }
}
export const createNewVoucherAdmin = async (input: CreateVoucherRequest, ctx) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new AdminManageVoucherApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminCreateVoucher(input)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to create voucher',
    })
  }
}

export const updateVoucherAdmin = async (input: { id: string; voucherUpdate: UpdateVoucherRequest }, ctx) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new AdminManageVoucherApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).adminUpdateVoucher(input.id, input.voucherUpdate)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    console.log('-----------', error.response.data)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.response.data.data.message || 'Failed to create voucher',
    })
  }
}
