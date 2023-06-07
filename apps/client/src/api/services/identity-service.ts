import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse, serialize } from 'cookie'
import { BuyCoinRequestApi, CoinApi } from 'ume-booking-service-openapi'
import { AuthApi } from 'ume-identity-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getIdentityInfo = async (ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new AuthApi({
      basePath: getEnv().baseIdentityURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getInfo()

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

export const getAccountBalance = async (ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const response = await new CoinApi({
      basePath: getEnv().baseBookingURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getTotalCoin()
    console.log(response)
    return {
      data: response.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get account balance',
    })
  }
}

export const requestRecharge = async ({ total, platform }, ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const reponse = await new BuyCoinRequestApi({
      basePath: getEnv().baseBookingURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).createBuyCoinRequest({
      amountCoin: Number.parseInt(total),
      platform: platform,
      unitCurrency: 'VND',
    })
    return {
      data: reponse.data,
      status: 'success',
      message: 'OK',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get data recharge',
    })
  }
}
