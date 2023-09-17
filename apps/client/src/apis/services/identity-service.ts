import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse, serialize } from 'cookie'
import { AuthApi, UserApi } from 'ume-service-openapi'
import { BuyCoinRequestApi, CoinApi } from 'ume-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getIdentityInfo = async (ctx) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
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
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new CoinApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getTotalCoin()
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
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new BuyCoinRequestApi({
      basePath: getEnv().baseUmeServiceURL,
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

export const getUserBySlug = async (input, ctx) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new UserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getUserBySlug(input)
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get data recharge',
    })
  }
}
