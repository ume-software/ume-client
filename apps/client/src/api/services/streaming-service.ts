import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse } from 'cookie'
import { CreateLiveStreamChannelRequest, LiveStreamChannelApi } from 'ume-steaming-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getListStreamChannels = async (query: { limit: string; page: string }, ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie)
    const response = await new LiveStreamChannelApi({
      basePath: getEnv().baseLivestreamURL,
      isJsonMime: () => true,
    }).getLiveStreamChannels(true, query.limit, query.page, '{"updatedAt":-1}')

    return {
      data: response.data,
    }
  } catch (error) {
    console.log('error at catch', error)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list stream channel',
    })
  }
}
export const getLiveStreamChannelById = async (query: { channelId: string; limit: string; page: string }, ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie)
    const response = await new LiveStreamChannelApi({
      basePath: getEnv().baseLivestreamURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getLiveStreamChannelById(query.channelId)

    return {
      data: response.data,
    }
  } catch (error) {
    console.log('error at catch', error)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get stream channel by channel id',
    })
  }
}
export const createNewstreamChannel = async (createLiveStreamChannelRequest: CreateLiveStreamChannelRequest, ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie)
    const response = await new LiveStreamChannelApi({
      basePath: getEnv().baseLivestreamURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).createNewLiveStreamChannel(createLiveStreamChannelRequest)

    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    console.log('error at catch', error)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to create new stream channel',
    })
  }
}
