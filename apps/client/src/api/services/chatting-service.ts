import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse } from 'cookie'
import { ChatChannelApi } from 'ume-chatting-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getListChattingChannels = async (query: { limit: string; page: string }, ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie)
    const response = await new ChatChannelApi({
      basePath: getEnv().baseChattingURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getChannels(query.limit, query.page, '{"updatedAt":-1}')

    return {
      data: response.data,
    }
  } catch (error) {
    console.log('error at catch', error)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list chatting channel',
    })
  }
}
export const getMessagesByChannelId = async (query: { channelId: string; limit: string; page: string }, ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie)
    const response = await new ChatChannelApi({
      basePath: getEnv().baseChattingURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getMessagesByChannelId(query.channelId, query.limit, query.page)

    return {
      data: response.data,
    }
  } catch (error) {
    console.log('error at catch', error)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get message by channel id',
    })
  }
}
